# liri-nodeApp
Unit 10 assignment

# Follow these to get started
## Installation Instructions

Run the following command to install all dependencies 

    npm install

Run the ff. command to install node-datetime dependency

    npm install node-datetime --save

##Operations instructions

Run the following command to run the project

    node liri.js
    node liri.js my-tweets
    node liri.js spotify-this-song <song title>
    node liri.js movie-this
    node liri.js do-what-it-says
    
##Business Flow
1. liri.js is executed
2. Dependencies are added
3. fx execute() is created
4. `process.argv[2]` is evaluated
   * if `process.argv[2]` is  = 'do-what-it-says', file 'random.txt' will be parsed and overwrite argv[2] and argv[3] then execute() will be called.
   * Otherwise execute() will be called without over writing argv[2] and argv[3]
5. Within execute(), a switch() will evaluate argv[2] and will run the code accordingly.
