  ```
   _________   _______    ________   ___  ___        _________   ________   ___        ___  __       
  |\___   ___\|\  ___ \  |\   ____\ |\  \|\  \      |\___   ___\|\   __  \ |\  \      |\  \|\  \     
  \|___ \  \_|\ \   __/| \ \  \___| \ \  \\\  \     \|___ \  \_|\ \  \|\  \\ \  \     \ \  \/  /|_   
       \ \  \  \ \  \_|/__\ \  \     \ \   __  \         \ \  \  \ \   __  \\ \  \     \ \   ___  \  
        \ \  \  \ \  \_|\ \\ \  \____ \ \  \ \  \         \ \  \  \ \  \ \  \\ \  \____ \ \  \\ \  \ 
         \ \__\  \ \_______\\ \_______\\ \__\ \__\         \ \__\  \ \__\ \__\\ \_______\\ \__\\ \__\
          \|__|   \|_______| \|_______| \|__|\|__|          \|__|   \|__|\|__| \|_______| \|__| \|__|
                                                                                                                                                                                                                                                                                      
  ```

[![Build Status](https://travis-ci.org/tim-tang/tim-tang.github.com.svg)](https://travis-ci.org/tim-tang/tim-tang.github.com)
[![Dependency Status](https://gemnasium.com/tim-tang/tim-tang.github.com.png)](https://gemnasium.com/tim-tang/tim-tang.github.com)

Visit the project's website at [http://timtang.me](http://timtang.me)

## Bootstrap blog

- Install dependencies

    ```
    $ bundle install 
    $ npm install
    $ npm install -g grunt-cli
    ```
    
- Go to <BLOG_HOME>/ and run Grunt to optimize image/css/js

    ```
    $ grunt
    ```

- Run blog

    ```
    $ jekyll server -w
    ```
- Auto deploy

    ```
    $ pip install fabric
    $ fab setup deploy
    ```

- Start Service

    ```
    docker run --name jekyll -p 80:80 -v /srv/jekyll:/srv/jekyll -v /srv/jekyll/default.conf:/etc/nginx/conf.d/default.conf -d nginx
    ```

## TODO:

- Uploading assets files to OSS.
- Write more blogs...

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/tim-tang/tim-tang.github.com/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
