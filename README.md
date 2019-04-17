# WDG Web Site
This is code used on the website for [Wycliffe Drama Group](https://www.wycliffedramagroup.co.uk/).  Hosted on Google Apps Script (GAS).

## Work flow
My work flow uses [Visual Studio Code](https://code.visualstudio.com/) and [Clasp](https://codelabs.developers.google.com/codelabs/clasp/#0) to edit and synchronise between the local and remote site.

### Clasp
Use `clasp push` to update the GAS site after local changes.

Use `clasp pull` to synchronise any changes made on the GAS site to bring them down locally.  It is not recommended to work this way.  Changes should only be made locally and then pushed to GAS.

## Testing code
From GAS open the **Publish/Deploy as web app...** menu item and click on the link in "Test web app for your latest code".

The URL needs a request of **?page=<your_page>** added to test your page, otherwise the default index page is displayed.

## Deploying
Versioning and deploying should be done from GAS.  When changes have been pushed with clasp and tested and are ready for release a new version should be saved then that version should be deployed.  This is all done from the **Publish/Deploy as web app...** panel.

## Security
You need to be logged in as webmaster-user@wycliffedramagroup.co.uk to make changes.
