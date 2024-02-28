from math import gcd


def lcm(p, q):
  '''
  最小公倍数を求める。
  '''
  return (p * q) // gcd(p, q)


def generate_keys(p, q):
  '''
  与えられた 2 つの素数 p, q から秘密鍵と公開鍵を生成する。
  '''
  N = p * q
  L = lcm(p - 1, q - 1)

  for i in range(2, L):
    if gcd(i, L) == 1:
      E = i
      break

  for i in range(2, L):
    if (E * i) % L == 1:
      D = i
      break

  return (E, N), (D, N)


def encrypt(plain_text, public_key):
  '''
  公開鍵 public_key を使って平文 plain_text を暗号化する。
  '''
  E, N = public_key
  plain_integers = [ord(char) for char in plain_text]
  encrypted_integers = [pow(i, E, N) for i in plain_integers]
  encrypted_text = ''.join(chr(i) for i in encrypted_integers)

  return encrypted_text


def decrypt(encrypted_text, private_key):
  '''
  秘密鍵 private_key を使って暗号文 encrypted_text を復号する。
  '''
  D, N = private_key
  encrypted_integers = [ord(char) for char in encrypted_text]
  decrypted_intergers = [pow(i, D, N) for i in encrypted_integers]
  decrypted_text = ''.join(chr(i) for i in decrypted_intergers)

  return decrypted_text


def sanitize(encrypted_text):
  '''
  UnicodeEncodeError が置きないようにする。
  '''
  return encrypted_text.encode('utf-8', 'replace').decode('utf-8')


if __name__ == '__main__':
  public_key, private_key = generate_keys(101, 3259)

  plain_text = 'Welcome to ようこそジャパリパーク！'
  print(public_key, private_key)
  encrypted_text = encrypt(plain_text, public_key)
  decrypted_text = decrypt(encrypted_text, private_key)

  print(f'''
秘密鍵: {public_key}
公開鍵: {private_key}

平文:
「{plain_text}」

暗号文:
「{sanitize(encrypted_text)}」

平文 (復号後):
「{decrypted_text}」
'''[1:-1])
