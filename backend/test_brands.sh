#!/bin/bash

BASE_URL="http://localhost:8000/api/brands"
AUTH="Authorization: Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6ImJTK1BoVy83eG9uVXhuMlgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2liY3hzZnZicWtpdW53dnNxeXlhLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIwZGM5YTA0MC03YzJlLTQ5MjAtOGVjMi1hNTIxZGZlMzlkN2EiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzUyOTg5NTE3LCJpYXQiOjE3NTI5ODU5MTcsImVtYWlsIjoieWFoeWExMTIxMjAwNkBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoieWFoeWExMTIxMjAwNkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiIwZGM5YTA0MC03YzJlLTQ5MjAtOGVjMi1hNTIxZGZlMzlkN2EifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc1Mjk4NTkxN31dLCJzZXNzaW9uX2lkIjoiMTA0NTFkMmMtMjA4NC00YmM1LThhZWItYWZkNWQxM2QzYmMwIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.-kAKh8quqgy78-q15AuhP-NtZLXik0999bgElW5Bsfk"

# 1. Create a new brand
echo "1️⃣ Create a new brand:"
CREATE_RESPONSE=$(curl -s -w "\nStatus: %{http_code}\n" -X POST "$BASE_URL/" \
  -H "$AUTH" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Brand","colors":["#FF0000","#00FF00"],"fonts":["Arial","Helvetica"],"logo_url":"https://example.com/logo.png"}')

echo "$CREATE_RESPONSE"
BRAND_ID=$(echo "$CREATE_RESPONSE" | python3 -c "import sys, json; import re; d=json.loads(re.search(r'({.*})', sys.stdin.read()).group(1)); print(d['id'])")

# 2. Get all brands
echo -e "\n2️⃣ Get all brands:"
curl -s -w "\nStatus: %{http_code}\n" -X GET "$BASE_URL/" -H "$AUTH"

# 3. Get brand by ID
echo -e "\n3️⃣ Get brand by ID:"
curl -s -w "\nStatus: %{http_code}\n" -X GET "$BASE_URL/$BRAND_ID" -H "$AUTH"

# 4. Update brand
echo -e "\n4️⃣ Update brand:"
curl -s -w "\nStatus: %{http_code}\n" -X PUT "$BASE_URL/$BRAND_ID" \
  -H "$AUTH" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Brand Name","colors":["#0000FF"],"fonts":["Futura"],"logo_url":"https://example.com/newlogo.png"}'

# 5. Delete brand
echo -e "\n5️⃣ Delete brand:"
curl -s -w "\nStatus: %{http_code}\n" -X DELETE "$BASE_URL/$BRAND_ID" -H "$AUTH"
