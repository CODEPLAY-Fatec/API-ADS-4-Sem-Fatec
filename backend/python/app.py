# Adicione estas importações no início do app.py
import json
import os

os.environ["HF_HOME"] = "D:\\huggingface_cache"

import mysql.connector
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from llama_cpp import Llama
from llama_cpp.llama_tokenizer import LlamaHFTokenizer

# Inicializar o aplicativo Flask
app = Flask(__name__)

CORS(app)

# Carregar variáveis de ambiente
load_dotenv()

# Configurar o LLM (mantendo a mesma configuração do chatbot original)
llm = Llama.from_pretrained(
    repo_id="meetkai/functionary-small-v2.4-GGUF",
    filename="functionary-small-v2.4.Q4_0.gguf",
    chat_format="functionary-v2",
    tokenizer=LlamaHFTokenizer.from_pretrained("meetkai/functionary-small-v2.4-GGUF"),
    n_gpu_layers=-1,
)


# Funções do chatbot
def greet_user():
    return "Olá! Bem-vindo ao sistema de gestão de projetos. Como posso ajudar?"


def list_projects():
    try:
        conn = mysql.connector.connect(
            user=os.getenv("DB_USER"), password=os.getenv("DB_PASSWORD"), host=os.getenv("DB_HOST"), database=os.getenv("DB_NAME")
        )
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM projects")
        projects = cursor.fetchall()

        conn.close()

        if projects:
            response = "Projetos encontrados:\n"
            for project in projects:
                response += (
                    f"\n* Nome: {project['name']}\n"
                    f"  Descrição: {project['description']}\n"
                    f"  Status: {project['status']}\n"
                    f"  Início: {project['start']}\n"
                    f"  Término: {project['finish']}\n"
                )
            return response
        else:
            return "Nenhum projeto encontrado no banco de dados."

    except mysql.connector.Error as err:
        return f"Erro ao acessar o banco de dados: {err}"


# Mapeamento de funções
functions_map = {
    "greet_user": greet_user,
    "list_projects": list_projects,
}

# Ferramentas do chatbot
tools = [
    {
        "type": "function",
        "function": {
            "name": "greet_user",
            "description": "Sauda o usuário e pergunta como pode ajudar",
            "parameters": {"type": "object", "properties": {}, "required": []},
        },
    },
    {
        "type": "function",
        "function": {
            "name": "list_projects",
            "description": "Lista todos os projetos do banco de dados",
            "parameters": {"type": "object", "properties": {}, "required": []},
        },
    },
]


# Funções para processamento do LLM
def get_function_details(message):
    result = llm.create_chat_completion(
        messages=[{"role": "user", "content": message}],
        tools=tools,
        tool_choice="auto",
    )
    function_call = result["choices"][0]["message"]["tool_calls"][0]["function"]
    function_name = function_call["name"]
    arguments = json.loads(function_call["arguments"])
    return function_name, arguments


def execute_function(function_name, arguments):
    function = functions_map.get(function_name)
    if function:
        return function(**arguments)
    return "Desculpe, não entendi o que você quis dizer. Poderia reformular a pergunta?"


# Modifique a rota do chatbot para:
@app.route("/chatbot", methods=["POST"])
def chatbot():
    data = request.json
    user_message = data.get("message", "")

    try:
        function_name, arguments = get_function_details(user_message)
        response = execute_function(function_name, arguments)
    except Exception as e:
        response = f"Ocorreu um erro ao processar sua solicitação: {str(e)}"

    return jsonify({"reply": response})


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
