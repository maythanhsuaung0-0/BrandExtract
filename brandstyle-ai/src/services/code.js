// Copyright 2023 Adobe. All rights reserved.
// This file is licensed under the Apache License, Version 2.0.

import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { editor, colorUtils } from "express-document-sdk";

const { runtime } = addOnSandboxSdk.instance;

async function brandify({ colors = [], fonts = [], logoUrl = "" }) {
  try {
    const doc = editor.documentRoot;
    const page = doc.pages.first;
    const artboard = page.artboards.first;
    const width = page.width;
    const height = page.height;

    // Remove previous brandify backgrounds/logos
    for (const node of artboard.children.toArray()) {
      if (node.name && node.name.startsWith("Brandify_")) {
        node.removeFromParent();
      }
    }

    // 2. Background rectangle
    if (colors.length > 0) {
      const bgRect = editor.createRectangle();
      bgRect.name = "Brandify_Background";
      bgRect.width = width;
      bgRect.height = height;
      bgRect.translation = { x: 0, y: 0 };
      bgRect.fill = editor.makeColorFill(colorUtils.fromHex(colors[0]));
      artboard.children.prepend(bgRect);
    }

    // 3. Add the logo (if available)
    if (logoUrl) {
      const img = await editor.createImageFromUrl(logoUrl);
      img.name = "Brandify_Logo";
      img.width = Math.min(200, width * 0.25);
      img.height = img.width * (img.naturalHeight / img.naturalWidth);
      img.translation = { x: 32, y: 32 };
      artboard.children.append(img);
    }

    // 4. Add sample headline with brand font and color
    if (fonts.length > 0) {
      const text = editor.createText();
      text.name = "Brandify_Heading";
      text.contents = "Your Brand Headline";
      text.fontFamily = fonts[0];
      text.fontSize = 64;
      text.fill = editor.makeColorFill(
        colorUtils.fromHex(colors[1] || "#111111")
      );
      text.translation = { x: 48, y: 200 };
      artboard.children.append(text);
    }

    // 5. Optionally, create colored rectangles for all palette colors
    if (colors.length > 1) {
      const swatchGroup = editor.createGroup();
      swatchGroup.name = "Brandify_ColorSwatches";
      artboard.children.append(swatchGroup);
      const swatchWidth = 80, swatchHeight = 32, gap = 16;
      colors.slice(0, 6).forEach((col, i) => {
        const swatch = editor.createRectangle();
        swatch.width = swatchWidth;
        swatch.height = swatchHeight;
        swatch.fill = editor.makeColorFill(colorUtils.fromHex(col));
        swatch.translation = {
          x: 48 + i * (swatchWidth + gap),
          y: height - swatchHeight - 40,
        };
        swatchGroup.children.append(swatch);
      });
    }

    return { success: true };
  } catch (err) {
    console.error("[Brandify] Error applying brand DNA:", err);
    return { success: false, error: err.message };
  }
}

const sandboxApi = {
  createShapes: function() {
    const insertionParent = editor.context.insertionParent;

    const rectangle = editor.createRectangle();
    rectangle.width = 200;
    rectangle.height = 150;
    rectangle.translation = { x: 100, y: 20 };

    const ellipse = editor.createEllipse();
    ellipse.rx = 150;
    ellipse.ry = 70;
    ellipse.translation = { x: 10, y: 200 };

    const text = editor.createText();
    text.text = "A Text Node";
    text.translation = { x: 20, y: 400 };
    text.textAlignment = 2;

    const rectFill = editor.makeColorFill(colorUtils.fromRGB(Math.random(), Math.random(), Math.random(), Math.random()));
    const ellipseFill = editor.makeColorFill(colorUtils.fromRGB(Math.random(), Math.random(), Math.random(), Math.random()));
    rectangle.fill = rectFill;
    ellipse.fill = ellipseFill;
    insertionParent.children.append(rectangle);
    insertionParent.children.append(ellipse);
    insertionParent.children.append(text);

    return "**** Shapes created successfully ****";
  },

  brandify: async function({ colors = [], fonts = [], logoUrl = "" }) {
    return await brandify({ colors, fonts, logoUrl });
  }
};

runtime.exposeApi(sandboxApi);
