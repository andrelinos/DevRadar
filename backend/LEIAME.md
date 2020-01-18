
# Tecnologias usadas 
```
"dependencies": {
    "axios": "^0.19.1",
    "cors": "^2.8.5",
    "express": "^4.17.1",
    "mongoose": "^5.8.7"
  },
  "devDependencies": {
    "nodemon": "^2.0.2"
  }
  ```
  Nesta api você pode adicionar e listar devs 
  
  
  # Armazenamento dos dados
  - Usado conexão com mongodb.com (banco de dados não relacional)
  
  # Para rodar o projeto 
  - Basta baixar a pasta do projeto e rodar yarn para baixar as dependências para o funcionamento da api
  - Configurar a conexão com o mongodb.com (necessário entra no site, criar uma conta e configurar uma nova base dados)
  - Clique no botão CONNECT que está dentro do mongodb.com
  - Escolha a opção *Conect Your Application*
  - Copie a String conforme exemplo abaixo:
  ```
  mongodb+srv://<username>:<password>@nomedobanco-9q70m.mongodb.net/test?retryWrites=true&w=majority
  ```
  - Edite o arquivo index.js na linha exemplo. 
  
  
