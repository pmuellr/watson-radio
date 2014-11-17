watson-radio - user modelled radio
================================================================================

`watson-radio` is a web application that will let you search
[Twtter](https://twitter.com/) for messages, have the
[Watson User Modeling service](http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/doc/systemuapi/)
determine characteristics of those messages,and then select a set from
[8tracks](http://8tracks.com/) matching the characteristics of those messages.



provisioning services
================================================================================

Before running the application, you will need to provision 3 services:

* Twitter service
* 8tracks service
* Watson User Modeling service

For the Twitter service, follow the instructions at <https://apps.twitter.com/>
to create a new application to use the Twitter API.  If you don't already have
a developer account for twitter, you'll need to create one.  When creating the
new app, you might use `watson-radio` for the name.  The URL should be the URL that
you will use for the new app, which might be something like
`https://watson-radio-xyz.mybluemix.net`, where `xyz` are your initials, so you have
a unique hostname on the `mybluemix.net` domain.  You do not need to provide
a Callback URL.

After the new application is created at Twitter, navigate to the "Keys and
Access Tokens" page.  Copy the values for "Consumer Key (API Key)" and
"Consumer Secret (API Secret)" somewhere, as those are your Twitter credentials.

For the 8tracks service, follow the instructions at
<http://8tracks.com/developers/new> to register for an API key.  You will get
a value for your new API key.  Copy the value of the 8tracks API key, as that
is your 8tracks credential.

For the Watson User Modeling service, we'll provision that using
`cf create-service`.



running locally
================================================================================

You will need [node.js](http://nodejs.org/) installed (version &gt;= 0.10.x).

Once you have that in order:

* create a git clone this repository; eg,

        git clone https://github.com/pmuellr/watson-radio.git

* run `npm install` to install node pre-req modules

* edit the manifest.yml file a unique `host` value.  This should be the same
  value as the hostname you registered with Twitter, above.

* copy the file `env-sample.json` to `env.json`, and replace the fill-in
  the blanks with the credentials from your Twitter and 8tracks services.

* create the app at Bluemix, without starting it, with the command

        cf push --no-start

* create the Watson User Modeling service, with the command

        cf create-service user_modeling user_modeling_free_plan watson-um

* bind the Watson User Modeling service to the app, with the command

        cf bind-service watson-radio watson-um

* get the credentials for the Watson User Modeling service, by using the command

        cf env watson-radio

  The `password`, `url`, and `username` properties are the credentials for
  the service.

* copy the file `vcap-sample.json` to `vcap.json`, and replace the fill-in
  the blanks with the credentials from your Watson User Modeling service
  credentials that were just printed.

* run the app using `node server`, bring up the URL it prints to interact with
  the application in a web browser.



running on bluemix
================================================================================

You need to set environment variables for the Twitter and 8tracks credentials.
Use the following commands:

    cf set-env watson-radio TWITTER_CONSUMER_KEY    <twitter consumer key>
    cf set-env watson-radio TWITTER_CONSUMER_SECRET <twitter consumer secret>
    cf set-env watson-radio TRACKS8_API_KEY         <8tracks api key>

You've already pushed the app, so you should be able to use `cf start watson-radio`
to start it, but if you've changed anything since pushing, use `cf push`.



attributions
================================================================================

The file www/images/icon.png originated at the web site below, and is released
to the public domain.

<http://commons.wikimedia.org/wiki/File:Happy_face.svg>



license / copyright
================================================================================

Copyright IBM Corp. 2014 All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

<http://www.apache.org/licenses/LICENSE-2.0>

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
