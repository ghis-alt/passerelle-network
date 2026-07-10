import sqlite3

g=sqlite3.connect("rf.db")

h=g.cursor()

h.execute("CREATE TABLE IF NOT EXISTS Produit(nom TEXT, prix INTEGER)")

h.execute("INSERT INTO PRODUIT(nom,prix) VALUES ('ghis',12000),('jean',5900)")
g.commit()
g.close()