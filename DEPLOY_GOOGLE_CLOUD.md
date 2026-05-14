# Google Cloud Deployment Guide

## 1. Enable APIs
Cloud Run, Cloud Build, Cloud Functions, BigQuery, Cloud Storage, Artifact Registry

## 2. Create bucket
gsutil mb -l asia-south1 gs://ruralcare-reports

## 3. BigQuery
bq mk ruralcare_dataset

## 4. Deploy backend
cd backend
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/ruralcare-api
gcloud run deploy ruralcare-api --image gcr.io/YOUR_PROJECT_ID/ruralcare-api --platform managed --region asia-south1 --allow-unauthenticated

## 5. Deploy frontend
cd frontend
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/ruralcare-web --substitutions=_VITE_API_URL=https://YOUR-BACKEND-URL
gcloud run deploy ruralcare-web --image gcr.io/YOUR_PROJECT_ID/ruralcare-web --platform managed --region asia-south1 --allow-unauthenticated

## 6. Deploy functions
cd cloud-functions/emergency-alert
gcloud functions deploy emergency-alert --runtime nodejs20 --trigger-http --allow-unauthenticated --region asia-south1

cd ../appointment-notify
gcloud functions deploy appointment-notify --runtime nodejs20 --trigger-http --allow-unauthenticated --region asia-south1
