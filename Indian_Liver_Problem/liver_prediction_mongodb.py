# -*- coding: utf-8 -*-
"""
Spyder Editor

This is a temporary script file.
"""
from pymongo import MongoClient
import pickle
import pandas as pd 
import sys, json

 
# for record in cursor:
#     print(record);

## compute_input.py


#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    #Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])

def main():
    #get our data as an array from read_in()
    hash_record = read_in()
    # print (hash_record)


    client = MongoClient('mongodb://localhost:27017')

    db = client['testdb']

    collection  = db['diagnosis']

    cursor = db.diagnosis.find_one({'diagnosis_id':hash_record}) 
#    print(cursor)
       
#    for i in cursor:
#        record=i;

    test_record = pd.DataFrame(data=[[cursor['age'], cursor['total_bilirubin'], cursor['direct_bilirubin'], cursor['alkaline_phosphotase'], cursor['alamine_amino_transferase'],
         cursor['asparate_amino_transferase'], cursor['total_protiens'], cursor['albumin'], cursor['albumin_and_globulin_ratio']] ]
    ,columns=['Age', 'Total_Bilirubin', 'Direct_Bilirubin', 'Alkaline_Phosphotase','Alamine_Aminotransferase', 'Aspartate_Aminotransferase', 'Total_Proteins', 'Albumin', 'Albumin_and_Globulin_Ratio'])

    # print (test_record)

    loaded_model = pickle.load(open('../Downloads/Indian_Liver_Problem/model_save.sav','rb'))
    result = loaded_model.predict(test_record)

#    print("Output label :" , result)

    if result[0]==0:
        result_str = "Not Liver Disease"
    else:
        result_str = "Liver Disease"


           

    collection.update_one({'diagnosis_id':hash_record},{"$set": { 'output': result_str }}) 
#    cursor = db.diagnosis.find_one({'diagnosis_id':hash_record})

    print (result_str)
    
#    print(cursor)

    # for i in cursor:
    #     record=i;

    # record = json.dumps(record)  

#start process
if __name__ == '__main__':
    main()
