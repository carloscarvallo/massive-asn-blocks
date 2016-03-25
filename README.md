# Massive ASN blocks
A script for mass scanning ASN blocks.

### Install
```
recommended install globaly: $ npm install asn-blocks -g
```

### Usage
```
$ asn-blocks [parameters]

and then follow instructions for scrap ASN blocks

example: $ asn-blocks nmap -sP
         $ asn-blocks smbclient -L

```


```
command executed will be:
$ nmap -sP 190.168.0.1/24
or
$ smbclient -L 190.168.0.1/24
```
