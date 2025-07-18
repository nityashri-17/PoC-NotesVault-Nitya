# PoC-NotesVault-Nitya

Workflow :

![NotesVault_PoC](https://github.com/user-attachments/assets/3f5844e7-58ba-4217-9be4-91a02db0c09b)


Feature Set :
1. JWT-based authentication [Login via Email Password] 
2. Create new notes [Title, Content, File attachments, Timestamps] 
3. File Attachments to be uploaded to S3 bucket 
4. Read notes or update 
5. Delete notes (also removes files from S3 bucket) 
6. Share notes [via URL]

MongoDB Schema for notes :   
{ 
  "_id": ObjectId, 
  "userId": ObjectId, 
  "title": "String", 
  "content": "String", 
  "fileURLs": ["String"], 
  "timestamps": "Date" 
} 
_id [generated automatically] [PK] 
user Id [references user] : Object Id [FK]

MongoDB Schema for user : 
{ 
  "_id": ObjectId, 
  "name": "String", 
  "email": "String", 
  "password": "String" 
} 
_id [generated automatically] [PK] 
