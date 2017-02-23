---
date: 2017-02-06
publish: draft
title: Keep your computer awake! 
description: Silly post, but a simple Java program to prevent your computer from going to sleep. Useful if you don't have privileges to modify your computers power settings. I don't condone any nefarious uses of this application, so apply this knowledge at your own risk.   
shortDescription: Java Program to keep your computer awake
headerImage: img/blog/stayawake/title.jpg
isProject: true
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.9.0/styles/atom-one-dark.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.9.0/highlight.min.js"></script>
<script>hljs.initHighlightingOnLoad();</script>

#### Keep your computer awake

Some time ago a friend of mine, who shall remain unnamed, asked me how they could keep their computer awake. Now, there are many reasons WHY someone may want to do this, but that isn't so important. Of course, the most obvious thing to do is change the computer settings to prevent it from going to sleep. However, in this particular case, those settings were locked away behind administrative privileges.

So, I had to get more creative. It turns out that there are many programs online which offer to keep your computer awake, by emulating user input. However, many of these are “sketchy” and if you are like me, you want something that you have complete control over. 

As a result, I wrote a quick Java application in 10 minutes that keeps your computer awake by emulating keyboard input. I should mention though, that I do not condone any nefarious use of this program or the knowledge presented here. 

You can find the source code for this project on [github](https://www.github.com).

*Note: The program includes a "fancy" GUI, but that isn't really required. The idea can also be implemented as a command line application*
<figure>
	<img src = "{{root}}img/blog/stayawake/application.gif">
	<figcaption> View of the Application running</figcaption>
</figure>

##### Details

If you are still here, you are probably wondering how exactly our little program keeps the computer awake.

As mentioned before, we generate native keyboard input. This is accomplished through the use of Java's wonderful [Robot](https://docs.oracle.com/javase/7/docs/api/java/awt/Robot.html) class. Take a look at the JavaDoc. This class was originally designed for automated testing of web applications, but has seen some pretty creative uses since. 

Below is the code listing for the meat of the application. Unfortunately, in my haste, there are alot of GUI specific functions present, but the general idea is to type out "hello world" every minute.

<pre class="col"><code class="java">
@Override
public void run() {       
    running = true;
    printConsole("Starting Bot\n");
    int count =0;
    while(running){
        printConsole("Running: " + count + "\n");
        count++;        
        try {
            type("Hello World\n");            
            printConsole("Sleeping for 1 minute\n");
            TimeUnit.MINUTES.sleep(1);
        } catch (InterruptedException ex) {
            printConsole("Stopping bot\n");
            running = false;
        }
    }
    frame.robotEnded();
}
private void type(String s) throws InterruptedException
{
    byte[] bytes = s.getBytes();
    for (byte b : bytes)
    {
        int code = b;
        // keycode only handles [A-Z] (which is ASCII decimal [65-90])
        if (code > 96 && code < 123) code = code - 32;
        Thread.sleep(500);
        robot.keyPress(code);
        robot.keyRelease(code);
    }
}
</code></pre>



