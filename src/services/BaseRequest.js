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
      } else if (status === 500) {
        toast.error("Erro interno do servidor.",{
          toastId: "serverError",
        });
      } else if (error.response.data.error == "failed to delete asset: another asset holds a reference to this one"){
        toast.error("Erro ao excluir o ativo. Outro ativo possui referência a este.",{
          toastId: "deleteError",
        });
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
    //if (setIsLoading) setIsLoading(false);
  }
}