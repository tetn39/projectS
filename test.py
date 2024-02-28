import random

id = '1123'

hex_id = id.encode().hex()

ans = ''
for i in hex_id:
    ans += i
    ans += random.choice('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
print(ans)


print(hex_id)


hexed_id = ans[::2]
print(hexed_id)

decode_id = bytes.fromhex(hexed_id).decode()
print(decode_id)