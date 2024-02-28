# MusicPlayer_React_Django_Rest_Sqlite


## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Database update](#update-database-with-model-changes-in-django)

## Overview

A music player application built with React for the frontend and Django Rest Framework for the backend, utilizing SQLite as the database.


## Features

- **User Authentication**: Sign up and log in functionality.
- **Music Playback**: Play, pause, and navigate through the music tracks.
- (Add more features as per your application)

## Technologies Used

- **Frontend**: React.js
- **Backend**: Django Rest Framework
- **Database**: SQLite
- **CI/CD**: GitHub Actions (as inferred from `.github/workflows/django.yml`)

## Setup and Installation

### Prerequisites

- Node.js
- Python
- Pipenv or virtualenv


### Fronted Setup

Navigate to the `front-end` directory and follow the steps:

1. Install Dependencies
   ```sh
   npm install
2. run front-end test server
   ```sh
   npm start
### Backend Setup

Navigate to the `back-end` directory and follow the steps:

1. Create a virtual environment and activate it
2. Install Dependencies
   ```sh
   pip install -r requirements.txt
3. run back-end test server
   ```sh
   python manage.py runserver
### Update Database with Model Changes in Django

1. Run the makemigrations command
   ```sh
   python manage.py makemigrations
2. Execute the migrate command
   ```sh
   python manage.py migrate
