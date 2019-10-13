#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu Jan 24 14:02:49 2019

@author: abd17
"""

import pandas as pd
#import numpy as np
#import matplotlib.pyplot as plt 
#plt.rc("font", size=14)
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.metrics import confusion_matrix
from sklearn import svm
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier 
from sklearn.neural_network import MLPClassifier
from sklearn.feature_selection import RFE
from sklearn.naive_bayes import GaussianNB, MultinomialNB
#from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import RepeatedKFold
from sklearn.utils import resample
import pickle


i=1
epoch=100
acc_log = 0
acc_svm = 0
acc_rf = 0
acc_dt = 0
acc_KNN = 0
acc_MLP = 0
acc_gnb = 0
acc_mnb = 0
for i in range(1,epoch):

    data = pd.read_csv('Indian Liver Patient Dataset (ILPD).csv')
    data.fillna(1, inplace = True)
    #data = data.fillna(lambda x: x.median())
    
    
#    print(data.shape)
#    print(list(data.columns))
    #print(data)
    
#    print(data['Output_Label'].value_counts())
    df_majority = data[data['Output_Label']==1]
    df_minority = data[data['Output_Label']==0]
     
    # Upsample minority class
#    df_minority_upsampled = resample(df_minority, 
#                                     replace=True,     # sample with replacement
#                                     n_samples=414,    # to match majority class
#                                     random_state=123) # reproducible results
#     
#    # Combine majority class with upsampled minority class
#    data = pd.concat([df_majority, df_minority_upsampled])
#    
#    print(data['Output_Label'].value_counts())
    
    
    cols=['Age', 'Total_Bilirubin', 'Direct_Bilirubin', 'Alkaline_Phosphotase','Alamine_Aminotransferase', 'Aspartate_Aminotransferase', 'Total_Proteins', 'Albumin', 'Albumin_and_Globulin_Ratio']
    X = data[cols]
    y = data['Output_Label']
    target_names = ['0', '1']
    #scaler = MinMaxScaler(feature_range=(0,1)).fit(X)
    #X = scaler.transform(X)
    #print(X)
    kf = RepeatedKFold(n_splits=5, random_state=None) 
    
    for train_index, test_index in kf.split(X):
    #      print("Train:", train_index, "Validation:",test_index)
          X_train, X_test = X.iloc[train_index], X.iloc[test_index] 
          y_train, y_test = y.iloc[train_index], y.iloc[test_index]
    #print(y)
    #X_train, X_test, y_train, y_test = train_test_split(X, y, stratify=y)
    #print(X_train)
    #print(y_train)
    
    
#    
#    logreg = LogisticRegression()
#    logreg = RFE(logreg, 9)
#    logreg.fit(X_train, y_train)
##    print(logreg.support_)
#    y_pred = logreg.predict(X_test)
##    print(set(y_pred))
#    acc_log += logreg.score(X_test, y_test)
    
#    print('Accuracy of logistic regression classifier on test set: {:.2f}'.format(logreg.score(X_test, y_test)))
#    print('\n')
#    print('Logistic Regression Classification Report:')
#    print(classification_report(y_test, y_pred, target_names=target_names))
#    print('\n')
    
    
    
    #Create a svm Classifier
    clf = svm.SVC(kernel='rbf',gamma=1) # Linear Kernel
    clf = RFE(clf, 9)
    
    #Train the model using the training sets
    svm_final=clf.fit(X_train, y_train)
    
    #Predict the response for test dataset
    y_pred_svm = clf.predict(X_test)
    acc_svm += svm_final.score(X_test, y_test)
    
    pickle.dump(svm_final,open('model_save.sav','wb'))
    
    
#    print(set(y_pred_svm))
#    
#    print('Accuracy of SVM classifier on test set: {:.2f}'.format(svm_final.score(X_test, y_test)))
#    print('\n')
#    print('SVM Classification Report:')
#    print(classification_report(y_test, y_pred_svm, target_names=target_names))
#    print('\n')
    
    
    
    # Instantiate model with 1000 decision trees
#    rf = RandomForestClassifier()
#    rf = RFE(rf, 9)
#    # Train the model on training data
#    rf_final=rf.fit(X_train, y_train)
#    
#    #Predict the response for test dataset
#    y_pred_rf = rf.predict(X_test)
#    acc_rf += rf_final.score(X_test, y_test)
##    print(set(y_pred_rf))
##    
##    print('Accuracy of Random Forest classifier on test set: {:.2f}'.format(rf_final.score(X_test, y_test)))
##    print('\n')
##    print('Random Forest Classification Report:')
##    print(classification_report(y_test, y_pred_rf, target_names=target_names))
##    print('\n')
#    
#    
#    
#    clf_gini = DecisionTreeClassifier()
#    clf_gini = RFE(clf_gini, 9)
#    dt_final = clf_gini.fit(X_train, y_train)
#    
#    #Predict the response for test dataset
#    y_pred_dt = clf_gini.predict(X_test)
#    acc_dt += dt_final.score(X_test, y_test)
#    
##    print(set(y_pred_dt))
##    
##    print('Accuracy of Decision Tree classifier on test set: {:.2f}'.format(dt_final.score(X_test, y_test)))
##    print('\n')
##    print('Decision Tree Classification Report:')
##    print(classification_report(y_test, y_pred_dt, target_names=target_names))
##    print('\n')
#    
#    
#    
#    classifier = KNeighborsClassifier()  
#    classifier = RFE(classifier, 9)
#    KNN_final = classifier.fit(X_train, y_train)
#    #Predict the response for test dataset
#    y_pred_knn = classifier.predict(X_test)
#    acc_KNN += KNN_final.score(X_test, y_test)
#    
##    print(set(y_pred_knn))
##    
##    print('Accuracy of KNN classifier on test set: {:.2f}'.format(KNN_final.score(X_test, y_test)))
##    print('\n')
##    print('KNN Classification Report:')
##    print(classification_report(y_test, y_pred_knn, target_names=target_names))
##    print('\n')
#    
#    
#    
#    #BackPropogation
#    clf_MLP = MLPClassifier(solver='adam', activation='relu', max_iter=500, hidden_layer_sizes=(9, 9))
#    clf_MLP = RFE(clf_MLP, 9)
#    MLP_final = clf_MLP.fit(X_train, y_train)
#    
#    y_pred_MLP = clf_MLP.predict(X_test)
#    acc_MLP += MLP_final.score(X_test, y_test)
##    print(set(y_pred_MLP))
##    
##    print('Accuracy of BackPropogation classifier on test set: {:.2f}'.format(MLP_final.score(X_test, y_test)))
##    print('\n')
##    print('BackPropogation Classification Report:')
##    print(classification_report(y_test, y_pred_MLP, target_names=target_names))
##    print('\n')
##    confusion_matrix = confusion_matrix(y_test, y_pred_MLP)
##    print(confusion_matrix)
##    print('\n')
#    
#    
#    
#    gnb = GaussianNB()
#    gnb = RFE(gnb, 9)
#    gnb_final = gnb.fit(X_train, y_train)
#    #Predict the response for test dataset
#    y_pred_gnb = gnb.predict(X_test)
#    acc_gnb += gnb_final.score(X_test, y_test)
##    print(set(y_pred_gnb))
##    
##    print('Accuracy of Gaussian Naive Bayes classifier on test set: {:.2f}'.format(gnb_final.score(X_test, y_test)))
##    print('\n')
##    print('Gaussian Naive Bayes Classification Report:')
##    print(classification_report(y_test, y_pred_gnb, target_names=target_names))
##    print('\n')
#    
#    
#    
#    #bnb = BernoulliNB()
#    #bnb_final = bnb.fit(X_train, y_train)
#    ##Predict the response for test dataset
#    #y_pred_bnb = bnb.predict(X_test)
#    #print(set(y_pred_bnb))
#    #
#    #print('Accuracy of Bernoulli Naive Bayes classifier on test set: {:.2f}'.format(bnb_final.score(X_test, y_test)))
#    #print('\n')
#    #print('Bernoulli Naive Bayes Classification Report:')
#    #print(classification_report(y_test, y_pred_bnb, target_names=target_names))
#    #print('\n')
#    
#    
#    
#    mnb = MultinomialNB()
#    mnb = RFE(mnb, 9)
#    mnb_final = mnb.fit(X_train, y_train)
#    #Predict the response for test dataset
#    y_pred_mnb = mnb.predict(X_test)
#    acc_mnb += mnb_final.score(X_test, y_test)
##    print(set(y_pred_mnb))
##    print('Accuracy of Multinomial Naive Bayes classifier on test set: {:.2f}'.format(mnb_final.score(X_test, y_test)))
##    print('\n')
##    print('Multinomial Naive Bayes Classification Report:')
##    print(classification_report(y_test, y_pred_mnb, target_names=target_names))
##    print('\n')
#    
#
#print('Accuracy of logistic regression classifier on test set: {:.2f}'.format(acc_log/epoch))
#print('\n')
#
#print('Accuracy of SVM classifier on test set: {:.2f}'.format(acc_svm/epoch))
#print('\n')
#
#print('Accuracy of Random Forest classifier on test set: {:.2f}'.format(acc_rf/epoch))
#print('\n')
#
#print('Accuracy of Decision Tree classifier on test set: {:.2f}'.format(acc_dt/epoch))
#print('\n')
#
#print('Accuracy of KNN classifier on test set: {:.2f}'.format(acc_KNN/epoch))
#print('\n')
#
#print('Accuracy of BackPropogation classifier on test set: {:.2f}'.format(acc_MLP/epoch))
#print('\n')
#
#print('Accuracy of Gaussian Naive Bayes classifier on test set: {:.2f}'.format(acc_gnb/epoch))
#print('\n')
#
#print('Accuracy of Multinomial Naive Bayes classifier on test set: {:.2f}'.format(acc_mnb/epoch))
#print('\n')









