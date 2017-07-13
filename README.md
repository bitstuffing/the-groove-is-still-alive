# The Groove Is Still Alive

What is this project? This project is an easy way to create a personal Grooveshark fork to get your personal library accesible from your browser. 

This project has been designed to work in your personal network, but if you are fine and has a legitimate content, you usually can get it working in your personal website. Anyway, I don't recommend it, at least at this current state (it's a little bit odd). 

This project is a personal web application written in PHP5 and Jquery without any other pluggin.

The idea of this project is get a portable application, which can run in any Raspberry Pi without drain his resources.

At this moment is a development revision, and has no all functionalities, but it can be tested with some little configurations:

- Configure .htaccess with your prefered folders (3 at this moment, remember, dev. rev.)
- Create an user (needs to be inside the users folder, the way to create one is make a folder with the username, put a file called passwd with the password inside this new personal folder, and create a folder inside user personal folder called lists).
- Push the button (after logged in): Generate albums from library folders and wait until finish (it doesn't use databases so needs some time when it's generated).
- Enjoy
