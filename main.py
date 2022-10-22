#from dateutil import parser
from datetime import date, datetime as dt
from re import U
from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, FileResponse
from deta import Deta
import secrets
import bcrypt
deta = Deta("b0w5qqde_q1eby1Vb5sG5CzNd7QWjHBMprFhFfcny")

users_db = deta.Base("users")


app = FastAPI()
app.mount("/assets", StaticFiles(directory="assets"), name="assets")

templates = Jinja2Templates(directory="templates")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# @app.get('/favicon.ico', response_class=FileResponse)
# async def favicon():
#     return FileResponse('assets/favicon.ico')

@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    k = request.cookies.get("key")

    if k is None:
        return templates.TemplateResponse("test.html", {"request": request})

    else:
        try:
            j = users_db.fetch({"key": k})

        except Exception as e:
            print(e)
            raise HTTPException(status_code=422, detail="Something went wrong")

        return templates.TemplateResponse("index.html", {"request": request, "user": j.items[0]})


@app.post("/login")
async def login_user(response: Response, request: Request, email: str = Form(...), password: str = Form(...)):
    j = users_db.fetch({"email": email.lower()})

    if j.count == 1:
        x = bcrypt.checkpw(password.encode(), j.items[0]['password'].encode())
        user = j.items[0]

        if x ==  True:
            response = templates.TemplateResponse("redirect.html", {"request": request, "url": "/"})
            response.set_cookie(key="key", value=user['key'])
            return response

        else:
            response = templates.TemplateResponse("redirect.html", {"request": request, "url": "/"})
            return response

    else:
        response = templates.TemplateResponse("redirect.html", {"request": request, "url": "/"})
        return response


@app.post("/register", response_class=HTMLResponse)
async def create_user(request: Request, response: Response, name: str = Form(...), email: str = Form(...), password: str = Form(...)):

    j = users_db.fetch({"email": email.lower()})

    if j.count != 0:
        response = templates.TemplateResponse("redirect.html", {"request": request, "url": "/"})
        return response


    else:
        try:
            p = password.encode()
            hashed_p = bcrypt.hashpw(p,"$2b$12$vj2GaHW10eRxDcJTTTAWI.".encode())
            key = secrets.token_urlsafe(12)

            u = {"key": key, "name": name, "email": email.lower(), "password": hashed_p.decode()}
            users_db.put(u)

            response.set_cookie(key="key", value=u['key'])
            return templates.TemplateResponse("index.html", {"request": request, "user": u})

        except Exception as e:
            print(e)
            response = templates.TemplateResponse("redirect.html", {"request": request, "url": "/"})
            return response


@app.get("/logout", response_class=HTMLResponse)
async def logout(response: Response, request: Request):

    response = templates.TemplateResponse("redirect.html", {"request": request, "url": "/"})
    response.delete_cookie("key", path="/")
    
    return response


#https://fastapi.tiangolo.com/es/advanced/custom-response/#redirectresponse
@app.post("/upc_lookup/{upc}", response_class=HTMLResponse)
async def upc_lookup(request: Request, upc: str):
    i_upc = upc
    return 0


# @app.post("/upc_lookup/")
# async def create_file(file: bytes = File()):
#     return {"file_size": len(file)}

# @app.api_route("/{path_name:path}", methods=["GET"]) #CATCH ALL ROUTES FOR 404 ADD 2 Diffent Pages Based on Cookie Saves to Browser or not
# async def catch_all(request: Request, path_name: str):
#     return "404 not found"


# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("main:app", host="localhost", reload=True)
