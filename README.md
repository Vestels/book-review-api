<ins>A kicsomagolás után terminálból ezeket futtassuk:</ins>

    - cd <path>/api-project
    - npm install
    - npm start
    

**Ha az -npm install nem telepített mindent megfelelően a dependeciák szerint.**

    - npm install express mongoose bcryptjs jsonwebtoken dotenv swagger-jsdoc swagger-ui-express cors 
      
      
**Sikeres futtatás esetén:**</br>
    </br>- http://localhost:3000 (pl.: Postman)</br>
    - Swagger dokumentáció: http://localhost:3000/api-docs

</br>**Az authentikált végpontok csak a sikeres bejelentkezés után generált JWT token-el fognak működni.**

*A regisztrációhoz szükséges felhasználói adatoknak legalább 10/10 karakter hosszúnak kell legyenek.
