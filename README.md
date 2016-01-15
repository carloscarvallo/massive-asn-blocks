# Massive ASN blocks
A script for mass scanning ASN blocks.


### Usage
```
$ node index.js [parameters]

example: $ node index.js nmap -sP
         $ node index.js smbclient -L

```


```
He will asked you for the ISO code of a country, 
and then a especific ASN that you want to scan for **that country**.

```


```
command executed will be:
**$ nmap -sP 190.168.0.1/24**
or
**$ smbclient -L 190.168.0.1/24**
```
