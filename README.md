A kicsomagolás után terminálból ezeket futtassuk:

    - cd <path>/api-project  // <path>: A kicsomagolt fájl elérési útvonala //
    - npm install
    - npm install express mongoose bcryptjs jsonwebtoken dotenv swagger-jsdoc swagger-ui-express cors // Ha az *npm install* nem telepített mindent megfelelően a dependeciák szerint //
    -npm start

Sikeres futtatás esetén ezt kapjuk vissza:
    Server is running on port 3000
    MongoDB connected

Ezután a project a http://localhost:3000 -en elérhető és tesztelhető (pl.: POSTMAN).
SWAGGER dokumentáció a projekthez a http://localhost:3000/api-docs -on érhető el és tesztelhető.

Az authentikált végpontok csak a sikeres bejelentkezés után generált JWT token-el fognak működni.
    - POSTMAN: Sikeres bejelentkezést követően a visszakapott JWT tokent másoljuk be ide -> Authorization -> Bearer Token -> Token.
    - SWAGGER: Sikeres bejelentkezést követően a visszakapott JWT tokent felül az Authorize-ba másoljuk be majd Authorize.

// A regisztrációhoz szükséges felhasználói adatoknak legalább 10/10 karakter hosszúnak kell legyenek. //