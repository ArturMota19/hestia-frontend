import api from "./Api";
import toast from "react-hot-toast";

export async function BaseRequest({
  method,
  url,
  data = {},
  setIsLoading = false,
  isAuth= false,
  // responseType = false,
  // credentials = false,
}) {

  try {
    // Enable loading
    if (setIsLoading) setIsLoading(true);

    // Make headers
    const headers = {
      // "responseType" : responseType ? responseType : "json",
      "Content-Type": "application/json",
      ...(isAuth && { Authorization: `Bearer ${localStorage.getItem("AHtoken")}` }),
    };

    const config = { headers };
    config.data = data;

    const response = await api({
      method: method.toLowerCase(),
      url,
      ...config
    });

    return response;
  } catch (error) {
    console.log(error)
    if (error.response) {
      // The request was made and the server responded with a status code
      const { status } = error.response;
      console.log(error.response)
      if (status === 401 && error.response.data.message === "Invalid token.") {
        toast.error("Token expirado. Faça login novamente.",{
          toastId: "authError",
        });
        localStorage.removeItem("AHtoken")
        window.location.href = "/login";
      }
      else if (status == 400 && error.response.data.error == "There is already a routine with this preset and priority for this user."){
        toast.error("Já existe uma pessoa com essa prioridade no seu preset.",{
          toastId: "authError",
        });
      }
      else if (status === 401) {
        toast.error("Houve um problema de autorização. Consulte o suas autorizações e tente novamente.",{
          toastId: "authError",
        });
      } else if (status === 403) {
        toast.error("Acesso negado.",{
          toastId: "accessDenied",
        });
      } else if (status === 404) {
        toast.error("Informações não encontradas.",{
          toastId: "notFound",
        });
      } else if (status === 409) {
        toast.error("Conflito de informações. Essas informações já existem no Banco de Dados.",{
          toastId: "serverError",
        });
      }else if (status === 423) {
        toast.error("Este objeto não pode ser deletado porque está sendo utilizado em outra tabela.",{
          toastId: "serverError",
        });
      }  else if (status === 500) {
        toast.error("Erro interno do servidor.",{
          toastId: "serverError",
        });
      } 
        else if(error.response.data.error == "Cannot edit preset: there are routines using this preset."){
        toast.error("Este preset não pode ser editado porque está sendo utilizado em uma rotina existente.")
      }
      else {
        toast.error("Houve um erro. Consulte as informações enviadas e tente novamente.",{
          toastId: "genericError",
        });
      }
    } else {
      // Something happened in setting up the request that triggered an Error
      toast.warning("Algum erro ocorreu e não pôde ser tratado.",{
        toastId: "unhandledError",
      });
    } 
  } finally {
    // Disable loading
    if (setIsLoading) setIsLoading(false);
  }
}