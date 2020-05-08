# Aufgabe 2

t = (4, 7, 9)
s = "Die Sonne scheint"
a = 1.2

a = int(a)
print(a) # Typ wandelt in Integer um

t = list(t)
print(t) # Typ wandelt in List um

s = list(s)
print(s) # Typ wandelt in List um

# Aufgabe 3

t = (4, 7, 9)
s = "Die Sonne scheint"
l = [34, 22.1,"777",[3, 4]]
t2 = (4, 8, [45, 91])
t[0]

# t[3] aus Shell: "IndexError: tuple index out of range." Der lIst hat nur 3 Elemente. Wenn wir auf 4. anruffen,
# dann gibt es eine Fehlermeldung

#t(3) aus Shell: "TypeError: 'tuple' object is not callable." Syntax Error.
# Man muss in eckigen Klammern die Variable anruffen

s[4]

# s[4] = "x" aus Shell: "TypeError: 'str' object does not support item assignment."
# Man kann nicht einzelne Zeichen in einem String verändern

# l[2][0] = "g" aus Shell: "TypeError: 'str' object does not support item assignment."
# "777" ist ein String, deswegen gibt es ein Syntax Error
l[3][0] = "h"
l
t2[2][0] = 23

# Aufgabe 4

a = "Betriebliche Anwendungen"
b = ["FIW"]
c = (566061, 17.05)

print(len(a)) #24
print(len(b)) #1
print(len(c)) #2

print(a[len(a)-1])  #n

# Aufgabe 5

five = "IY otuh ihnakv ei ta  ipsr oac endeuwr ef ewaittuhr e1.0  Dpoanr'atm etteelrls ?a nyyooun ep riotb awbalsy  amni sascecdi dseonmte.."

print(five[0::2])
