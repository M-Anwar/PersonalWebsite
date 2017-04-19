---
date: 2017-04-10
title: What's Cooking?
description: Cuisine Identification using Word Embedding’s. An exploration of using word embeddings to cluster recipes to predict the cuisine given a list of ingredients. We also explore T-SNE for dimensionality reduction for visualization.
shortDescription: Cuisine Identification using Word Embedding’s.
headerImage: img/projects/whatscooking/title.jpg
isProject: true
---
The <a href="{{root}}img/projects/whatscooking/index.html"> t-SNE Visualization </a> can be found here. Implemented in WebGL.

The <a href="{{root}}img/projects/whatscooking/FinalProject.html">python notebook for this project can be found here </a>. This is the final project for the course CSC412.
___

##### Introduction
Food is an important component of our everyday lives and can define important aspects of our culture. The ingredients used in cuisines around the world have a unique identity and capture a rich history. By exploring the relationships between ingredients and cuisine we can gain more insights into the pervasive nature of food within human life. It can also provide interesting opportunities to explore comparisons between different natural language techniques as recipes are shared in words.

In this project we seek to predict the recipe’s cuisine given a list of ingredients. Furthermore, we explore the nature of the ingredients themselves, by learning relationships between them in an unsupervised setting.

##### Data Set
To study this problem we first had to assemble a data set of recipes with annotated cuisine labels. For this we used a public data set on Kaggle introduced by Yummly, a very popular recipe platform. The data-set consists of over 39000 recipes with more than 6 thousand unique ingredients. These recipes are spread across 20 cuisines ranging from Italian to Brazilian food, covering a good number of tastes from around the world.

##### Proposed Model
To predict recipe cuisine from a list of ingredients we propose using an unsupervised method to induce ingredient level features (word2vec and skip-thought vectors). These ingredient features are then clustered using a Gaussian mixture model. Each cluster is assigned a cuisine class using the most probable label from the included ingredients. These clusters are then used to make predictions on the cuisine of a novel recipe. While the method above has a few limitations, learning the ingredient level features allows us to explore interesting relationships between cuisines. In particular we take the ingredient features and do a dimensionality reduction on them (t-SNE). We can then visualize these to determine the quality of our clustering as well as the nature of the ingredients (i.e. similarity across cuisines etc.). 

<figure>
    <div class="lightbox">
        <img src="{{root}}img/projects/whatscooking/model.png" style="background:white" alt="What's Cooking proposed model">
    <div>
    <figcaption> Our proposed method for cuisine identification. a) The recipe ingredients b) Ingredients embedded into a previously clustered ingredient vector space c) Most probable cuisine from the clusters is chosen. </figcaption>
</figure>

The primary contribution of this project is applying various unsupervised methods (word2vec and skip-thought vectors) to the recipe data and producing ingredient level features. Then taking these features and performing clustering on them to make predictions on novel recipes. Furthermore, we apply a T-SNE dimensionality reduction method to generate interesting visualizations of the data, to determine the quality of our clustering and see interesting relationships between ingredients. 

##### Results
We applied both word2vec and skip-thought vectors to define an embedding space for our data set.

For word2vec, the embedding was learned using all our training recipes ingredients, and produced a 100 dimensional embedding space for the ingredients. We then trained a GMM to cluster the embedded vectors using 20 mixture components. A label was then assigned to each cluster based on the most prevalent ingredient cuisine assignment. We then ran t-SNE to visualize the clustered data in 2D and 3D. From the visualization it can be seen that close points in the plot are clustered with the same colours. Furthermore, it seems like the correct ingredients are being assigned to the correct labels. However, there are still issues in the clustering like &quot;Italian bread&quot; being classified as a Chinese ingredient. 

For skip-thought vectors we learn a 4800 dimension embedding for each recipe across the entire set of training recipes. The same procedure as above is applied to these embedded vectors. Unfortunately the results for skip-thought embedding’s aren&#39;t as good. Skip-thought vectors are meant to work on entire sentences of data that share some semantic or grammatical similarity. Unfortunately passing in independent recipes doesn’t work so well, and the embedding ends up looking like the order they were trained in.
<figure>
    <div class="lightboxgallery">
        <img  width=300  src="{{root}}img/projects/whatscooking/TSNE-W2V.png" style="background:white" alt="What's Cooking proposed model">
        <img  width=300  src="{{root}}img/projects/whatscooking/TSNE-Skip.png" style="background:white" alt="What's Cooking proposed model"><br>    <div>
    <figcaption> t-SNE visualizations for word2vec ingredient embedding (left) and skip-thought recipe vectors (right).  </figcaption>
</figure>
<a href="{{root}}img/projects/whatscooking/index.html"> Full interactive visualizations can be found here. </a>

##### Conclusion
In this project, we investigated different approaches to embedding a recipe into a vector shape, which can be used to predict the cuisine associated with each recipe. Based on the 2 experiments we performed, we found an above chance level of predictive accuracy when using Word2Vec and Skip-thought as our embedding methods and GMM to cluster and classify the new examples. Furthermore, we found the predictive accuracy when using the embedding’s from Word2Vec to be significantly higher than when using embedding’s from Skip-thought.
