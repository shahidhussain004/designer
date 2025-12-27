import bcrypt

stored = b"$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/za."
plain = b"Admin123!"
print(bcrypt.checkpw(plain, stored))
