

// SASS watch / compress
// doc: http://sweetme.at/2013/09/18/compress-your-css-output-with-the-sass-command-line-tool/

command:
sass --watch _sass:css
sass --scss -t compressed _sass/main.scss css/main.css