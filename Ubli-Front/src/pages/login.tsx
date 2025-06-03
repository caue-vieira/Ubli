import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";

const loginFormSchema = z.object({
  usuario: z.string().min(2),
  senha: z.string(),
  email: z.string().email(),
  cpf: z.string().min(11).max(11),
})

function onLogin(values: z.infer<typeof loginFormSchema>) {
  console.log(values);
}

function Login() {
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema)
  })

  return (
    <Tabs defaultValue="login">
      <TabsList>
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="cadastro">Cadastre-se</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Card>
          <CardHeader>Login</CardHeader>
        </Card>
      </TabsContent>
      <TabsContent value="cadastro">
        <Card>
          <CardHeader className="px-5">Cadastre-se</CardHeader>
          <CardContent className="px-5">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="flex flex-col gap-2">
                <FormField
                  control={loginForm.control}
                  name="usuario"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Usuário</FormLabel>
                      <FormControl>
                        <Input placeholder="Usuário" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField 
                  control={loginForm.control}
                  name="usuario"
                  render={({field}) => (
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
                  name="cpf"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input placeholder="CPF" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField 
                  control={loginForm.control}
                  name="senha"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input placeholder="Senha" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default Login;
