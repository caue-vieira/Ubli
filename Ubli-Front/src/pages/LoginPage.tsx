import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import logo from "../images/logo-completo.png";
import { Button } from "@/components/ui/button";
import { getUbliAcessibilidadeUrbana } from "@/api/generated/ubliAcessibilidadeUrbana";

const registerFormSchema = z.object({
  usuario: z.string().min(2),
  senha: z.string().min(8),
  email: z.string().email(),
  cpf: z.string().min(11).max(11),
});

const loginFormSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(8),
});

async function onRegister(values: z.infer<typeof registerFormSchema>) {
  const { cadastraUsuario } = getUbliAcessibilidadeUrbana();
  const usuario = {
    nome: values.usuario,
    email: values.email,
    senha: values.senha,
    cpf: values.cpf,
    foto_perfil: null
  }
  await cadastraUsuario(usuario).then(
    
  ).catch(error => console.log(error.response));
  console.log(values);
}

async function onLogin(values: z.infer<typeof loginFormSchema>) {
  const { login } = getUbliAcessibilidadeUrbana();
  const usuario = {
    email: values.email,
    senha: values.senha,
  }
  await login(usuario).then(
    // Redirecionar o usuário para a tela principal
  ).catch(error => console.log(error.message));
}

function Login() {
  const registerForm = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      usuario: "",
      email: "",
      senha: "",
      cpf: "",
    },
  });

  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  return (
    <Tabs defaultValue="login" className="w-[25%]">
      <TabsList className="w-full">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="cadastro">Cadastre-se</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <img src={logo} className="w-[50%] mx-auto my-2" />
          </CardHeader>
          <CardContent className="px-8">
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(onLogin)}
                className="flex flex-col gap-2"
              >
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="senha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Senha" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button className="hover:cursor-pointer bg-[#4585C3] hover:bg-[#073359]">
                  Entrar
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="cadastro">
        <Card>
          <CardHeader>
            <img src={logo} className="w-[50%] mx-auto my-2" />
          </CardHeader>
          <CardContent className="px-8">
            <Form {...registerForm}>
              <form
                onSubmit={registerForm.handleSubmit(onRegister)}
                className="flex flex-col gap-2"
              >
                <FormField
                  control={registerForm.control}
                  name="usuario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usuário</FormLabel>
                      <FormControl>
                        <Input placeholder="Usuário" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input placeholder="CPF" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="senha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Senha" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button className="hover:cursor-pointer bg-[#4585C3] hover:bg-[#073359]">
                  Cadastre-se
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="text-sm text-zinc-600">
            <h1 className="mx-auto">
              Já tem uma conta?
              <a href="/login"> Cadastre-se</a>
            </h1>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default Login;
