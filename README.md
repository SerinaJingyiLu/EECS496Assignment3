# Interactive Visualizer | JINGYI LU & LINGZHI XI

## Topic: Global Terrorism Activities

Global Terrorism Activities Visualizer for Northwestern's EECS 496 Assignment 3: Creating an Interactive Visualization. See a live demo [here](https://www.google.com).

## Setup

1. Make sure you have Node.js installed. 

2. Open terminal.

3. cd to the root repository.

4. cd interactive-visualization.

5. Run `npm install` to install all the packages.

6. Once packages have installed, run `npm start` to see the application locally.

** It is recommended to use Chrome with browser width > 1280px.

## Files

1. All the front-end related code is under `src` folder.

2. All the datasets are under `src/lib/dataset`.

3. All the code for processing data is under `src/python` folder.

4. We used the data in `filtered_dataset_small.json`, which only collects gloabl terrorism activities from 2016 to 2017. For a larger dataset, you could use `filtered_dataset.json`, which collects gloabl terrorism activities from 2012 to 2017. To do this, you could simply change the code in `src/App.js`:  <br/>
```
//change line 25 as follows
const extractData = require("./lib/dataset/extract_dataset.json");

//change line 143 as follows
const terrorist = await require("./lib/dataset/filtered_dataset.json");
```




