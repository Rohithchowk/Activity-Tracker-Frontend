# eLitmus project (Time Tracker) #RohithChowki

![image](https://github.com/JasonChen1203/auto-productivity-tracker/blob/main/public/demo.png?raw=true)

A chrome extension which is developed for a eLimtus assessment that track the user's web activities throughout the day and record their time on websites that they deem productive or unproductive. The app contains options such as pausing/continuing tracking web activities, clearing all web data, and changing the amount of time the app will stop tracking after the user has gone idle.
Any user with email and password can create an account and then he can view his personal dashboard , The dashboard contains a sidenav and it contains navitems 'History' , 'Productive, 'Plotview' and 'Feedback'

## Functionalities & Usage

The webtime tracker tracks the user's web activities throughout the day. It displays the data on a donut chart, followed by a list that shows the user's spent time on each website. The app has 2 more tabs, where the user can add or remove websites that they deem productive or unproductive. It is an useful tool that records the user's browing activities, and illustrates the user's productivity on the web. The user can navigate to Dashboard and then he can click on the navitem that he wants , there are 4 navitems 

1.(Navitem 1)History , in this tab , all the website names and time usage is displayed in a tabular format ( a mui table).
2.(Navitem 2)Productive , in this tab , a graph and pie chart  is shown to you, plotting productive time usage and unproductive time usage data
3.(Navitem 3)Plot-view , in this tab , a piechart, and line chart , is displayed , with all websites and its time usage plot.
4.(Navitem 4)Feedback , here the website gives a feedback based on the time he spent on browser .

The time tracker data is continously upserted into sql and mongodb . so that he can view anytime whenever he wants , by logging in and navigating to dashboard .

Inside the Settings tab, the user can adjust the inactivity interval - the amount of time the app will stop tracking after the user has gone idle. For example, when the inactivity interval is set to 5 minutes and the user visits Google and goes idle, the tracker will track for 5 minutes before stopping. There are also options for pausing/continuing tracking all web activities, and clearing all recorded browsing activities.


## Technologies Used
Frontend : React.js ,for styling MUI.
Backend : the backend is developed in two different technologies (Rubyonrails +sql) and  (Nodejs +Express.js +Mongodb), both are working completely fine , you can execute in either technology you want . 

Here the data is stored continously in mongodb and sql (depending on  whatever technology , your'e going to execute with .)
          
## How to Set Up

This chrome extension is currently in the process of migrating from manifest v2 to v3, and it is temporarily unavailable from the chrome web store. To use the manifest v2 version, follow the steps below:

1. Download the main branch of this repository
2. Go to Chrome , and browse chrome://extensions and enable developer mode 
3. Click on the ```Load Unpacked``` button on the top left corner and load the ```build``` folder of the downloaded repository.

The extension is loaded and can be used.

![image](https://github.com/JasonChen1203/auto-productivity-tracker/blob/main/public/demo_01.png?raw=true)

