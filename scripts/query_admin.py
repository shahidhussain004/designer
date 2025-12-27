import os
import sys

try:
    import psycopg2
except Exception as e:
    print('MISSING_PG: psycopg2 not installed')
    print(e)
    sys.exit(2)

host = 'localhost'
port = 5432
dbname = 'marketplace_db'
user = 'marketplace_user'
password = 'marketplace_pass_dev'

try:
    conn = psycopg2.connect(host=host, port=port, dbname=dbname, user=user, password=password)
    cur = conn.cursor()
    cur.execute("SELECT id, email, username, password_hash, role, is_active, updated_at FROM users WHERE email=%s", ('admin@designermarket.com',))
    row = cur.fetchone()
    if not row:
        print('NOT_FOUND')
    else:
        print('FOUND')
        print('id:', row[0])
        print('email:', row[1])
        print('username:', row[2])
        print('password_hash:', row[3])
        print('role:', row[4])
        print('is_active:', row[5])
        print('updated_at:', row[6])
    cur.close()
    conn.close()
except Exception as e:
    print('ERROR')
    print(str(e))
    sys.exit(3)
