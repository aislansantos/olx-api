# olx-api

Projeto nodejs de um "clone" do backend da olx, funcionalidades deste mesmo são:

- Criar os anuncios;
- Validadar para que somente os proprietários do anúncios, tenham acesso a edição;
- Listar todos os estados que temos cadastrados para venda;
- Listar todos o anúncios;
- Mostrar um anúncio especifico mostrando ou não outros do mesmo vendedor;
- Mostrar somente anúncios ativos;
- Listar dados do anunciantes(atenticado);
- Editar dados dos anunciantes(atenticado);
- Cadstro de anunciante;
- Login(Atenticação);

## Informações

### Rotas

metodo: get > rota:/states > Lista estados cadastrados;

método: post > rota:/user/signin > Login na aplicação;
método: post > rota:/user/signup > Cadastro na aplicação;

metodo: get > rota:/user/me > Mostra os dados do usuário cadastrado > autenticada: token;
método: put > rota:/user/me > Edita algum dados do usuário cadastrado > autenticada: token;

metodo: get > rota:/categories > Lista as categorias;

método: post > rota:/ads/add > Adicionar um anúncio > autenticada: token;
metodo: get > rota:/ads/list > Lista todos anúncios;
metodo: get > rota:/ads/item > Lista um anúncio especifico, enviando a propriedade other como true, lista todos os anúncios deste mesmo usuário;
método: post > rota:/ads/:id > Edita os dados do anúncio selecionado > autenticada: token;

### Propriedades

#### anuncios

##### Ads

title: Titulo do anúncio;
price: preço do item(R$ 0.000,00);
priceneg: preço negociável(true/false);
desc: descrição do anuncio;
cat:categoria(id);
token: hash do usuário logado;
other: outros anuncios na lista(true/false);

##### User

name: pelo menos dois caracteres
state: ID
email: email em formato valido
password: pelo menos 2 caracteres

## Tecnologias

Neste projetos desenvolvido usando nodeJs, Express, typescrip, mongoDB, mongoose, eslint, prettier, jest, husk, lint-staged e path mapping.
