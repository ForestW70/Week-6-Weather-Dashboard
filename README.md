# Forest Wilson - Homework 6 - Weather Dashboard

I know you have the travel bug, and I also know you can not handle being somewhere hot right now, so go on and use this weather dashboard to check the current weather and 5 day forecast for any city in the world. Check today's weather, store cities you are curious about and compare future weather using the past search buttons for quick changing. Also if you are fair skinned, this will help you decide if suncreen will be a good idea today or not.  

## Comments

This project took me way longer than I thought to complete, especially since it happened before the group projet which really needed me to be fully invested into that. Looking back on how many moving parts were really needed to get this app running I feel good that I was able to impliment all the criteria, but it really seemed like every aspect of this was breaking all the time, but I guess thats how it goes eh

I found incredible frustration implementing proper time and date functionality. I initially started to try using momentjs but after many many issues and googling it really seemed like the js date object was what I really needed, especially when I had to use a unix format to translate it to plain text. I wish we learned how to use this way to manipulate the date becuase i was constantly getting hung up when trying to display what i wanted to.

also spent way too long trying to get local time to display accuratly on the selected city screen just to reread the prompt and realize it was totally uneeded. doh.

getting those past search buttons to display exactly how i wanted them too with no errors or redundencies was a pain as well

## Issues

It was really hard to tell if the weather info i was grabbing was even accurate to the area, so it took me a while to make finalize the appened data for the cities correctly. the data objects helped me confirm that the cities had unique weather data showing up, but when I compared to other weather app for the cities that data seemed to diverge a lot. to the best of my knowledge the weather is getting called correctly, but I think that you might need to buy the dlc to get the real accurate weather.


## Screenshots

![App page big screen](./assets/images/appbigscreen.png)
![App page small screen](./assets/images/appsmallscreen.png)
![App page phone screen](./assets/images/appphonescreen.png)

## Relevant links

[Live site](https://forestw70.github.io/hw6weatherdashboard/)
<br>
[Repo](https://github.com/ForestW70/hw6weatherdashboard)
