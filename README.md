## Online Visitors Counter ##

Real-time online visitors counter using Ajax, PHP PDO and SQLite.

It adds a discrete link (auto-refreshed every 15 seconds) with the number of current users on the website.

![](http://i.imgur.com/EJfXHgs.png)

If the link is clicked, a list of pages currently been visited appears, along with the number of visitors in each page.

![](http://i.imgur.com/SoYLh8o.png)


## Usage ##

Download and unzip [this package](https://github.com/felladrin/online-visitors-counter/archive/master.zip).

Then upload the folder `ovc` to your website (anywhere).

Now you just need to call it:

    <script src='path/to/ovc/counter.js'></script>

## Example ##

The `index.html` of this package is the best example you can find. You'll understand when you run it. (Remember it needs to be run on a PHP server).

But here is another quick example: Let's say your website is `http://example.com` and you've uploaded the `ovc` folder to the root directory, you would call the script like this:

	<script src='http://example.com/ovc/counter.js'></script>

## Customizing ##

On the config.php file, you'll find a lot of customizable parameters. Easy to set, as you can see on the following example.

If you want the link to show "X Online", you'd set:

	$visitorSingular = "Online";
	$visitorPlural = "Online";
	$linkFormat = '%1$d %2$s';

And the result would be:

![](http://i.imgur.com/QaVxal7.png)

## License ##

The MIT License (MIT)
