# Computer Reset UI

This is the UI for the Computer Reset Liquidation site. This is written in Angular 11, and sits atop the Computer Reset API project which is a .NET core project.

Hosting is performed on an Azure App Service - this is because of authentication requirements.

## Login flow

Only Facebook authentication is supported, and this is handled via the EasyAuth flow in Azure. Calls in order are:

| Order | Endpoint | Called by | Notes |
|--|--|--|--|
| 1 | /.auth/me | app.config.service.ts | Get the Facebook login user ID and name, and access token |
| 2 | /api/users | app.component.ts | HTTP post to the API to convert the access token to a JWT. |
| 3 | /api/users/attrib | app.component.ts | HTTP post to get the user attributes, and create a user if the user does not already exist. |

When running in development mode, a specified user ID stored in environment.ts will be used to override Facebook login.

## Admin functionality

Admin functionality is protected in the UI by a route guard. All of the APIs also have protection to require the user to be flagged in the database.

### Manual users

Users can be manually added via the admin UI. They are assigned a fake Facebook ID via a sequence stored in the database, with a value lower than any Facebook user ID.

## Automated tests

This project has none. Sorry. While it would be best practice to do so, this is supposed to last a short period of time before the site gets destroyed upon completion of the liquidation.
