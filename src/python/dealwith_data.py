import pandas as pd

terror=pd.read_csv('./globalterrorismdb_0718dist.csv',encoding='ISO-8859-1')
terror.rename(columns={'iyear':'Year','imonth':'Month','iday':'Day','country_txt':'Country','region_txt':'Region','attacktype1_txt':'AttackType','nkill':'Killed','nwound':'Wounded','weaptype1_txt':'Weapon_type','motive':'Motive'},inplace=True)
terror=terror[['Year','Month','Day','Country','Region','city','latitude','longitude','AttackType','Killed','Wounded','Weapon_type']]
terror['casualities']=terror['Killed']+terror['Wounded']
terror.to_csv ('./glabl_terrorism_dataset.csv', index=None, header=True)