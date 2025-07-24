// Components
import Header from "../../basics/Header/Header";
// Images
// Imports
import { Accordion, AccordionTab } from "primereact/accordion";
import { useTranslation } from "react-i18next";
//Styles
import s from "./HowToUse.module.scss";
import { Helmet } from "react-helmet";

export default function HowToUse() {
    const { t } = useTranslation();

    return (
        <main className={s.wrapperFinalFile}>
            <Helmet>
                <meta charSet="utf-8" />
                <title>HESTIA | How To Use</title>
            </Helmet>
            <Header />
            <section className={s.hestiaInfoWrapper}>
                <h1>{t("howToUse")}</h1>
                <div className={s.wrapperInternForm}>
                    <Accordion>
                        <AccordionTab header="Para que serve o INTERFACE HESTIA?">
                            <p className="m-0">
                                A Interface HESTIA foi desenvolvida com o
                                objetivo de facilitar a criação de casos de
                                teste para o sistema original HESTIA. Devido ao
                                grande volume de dados envolvidos, esse processo
                                tornou-se desafiador. A interface visa
                                simplificar e agilizar essa etapa, permitindo a
                                geração de exemplos representativos de maneira
                                mais eficiente e acessível.
                            </p>
                        </AccordionTab>
                        <AccordionTab header="Como funciona?">
                            <p className="m-0">
                                O projeto permite que o usuário crie{" "}
                                <strong>PARÂMETROS</strong> e{" "}
                                <strong>PRESETS</strong> para a criação de
                                rotinas. Evitando assim retrabalho na criação
                                dos arquivos JSON. Após criar parâmetros e
                                associá-los à um preset, basta criar rotinas
                                para cada pessoa que pertence àquele preset.
                            </p>
                        </AccordionTab>
                        <AccordionTab header="Parâmetros e Presets">
                            <Accordion>
                                <AccordionTab header="Parâmetros">
                                    <p>
                                        Parâmetros são objetos que podem ser
                                        criados pelo usuário e associados em
                                        diversos presets, além de auxiliarem na
                                        criação de rotinas. Os parâmetros são a
                                        base de um preset, e por conta da
                                        possibilidade de serem reutilizados em
                                        vários presets diferentes, tornam o
                                        processo de criação menos manual e mais
                                        ágil.
                                    </p>
                                    <ul>
                                        <li>
                                            <strong>Pessoas:</strong> Pessoas
                                            que vivem em um espaço. Podem ser
                                            reutilizadas em vários presets
                                            diferentes.
                                        </li>
                                        <li>
                                            <strong>Atividades:</strong>{" "}
                                            Atividades que as pessoas realizam
                                            em um espaço. Podem ser reutilizadas
                                            em vários presets diferentes, e
                                            ocorrerem várias vezes durante uma
                                            rotina.
                                        </li>
                                        <li>
                                            <strong>Cômodos:</strong> Cômodos
                                            dentro de um espaço. Podem ser
                                            reutilizados em vários presets
                                            diferentes.
                                        </li>
                                        <li>
                                            <strong>Atuadores:</strong>{" "}
                                            Atuadores que pertencem à um cômodo.
                                            Podem ser reutilizados em vários
                                            cômodos, e instanciados mais de uma
                                            vez por cômodo.
                                        </li>
                                        <li>
                                            <strong>
                                                Atividade com Preset:
                                            </strong>{" "}
                                            Atividades associadas a um preset.
                                            Aqui é possível criar atividades
                                            secundárias e a probabilidade de
                                            ocorrerem no meio de uma atividade
                                            principal. Além disso, também é
                                            possível selecionar atuadores que
                                            são modificados durante a atividade.
                                        </li>
                                    </ul>
                                </AccordionTab>
                                <AccordionTab header="Presets">
                                    <p className="m-0">
                                        Os Presets são a maneira em que o
                                        sistema cria "espaços" em que uma rotina
                                        se passa. Dentro de um preset é possível
                                        criar associar instâncias de parâmetros
                                        que pertencem àquele espaço.
                                    </p>
                                </AccordionTab>
                            </Accordion>
                        </AccordionTab>
                        <AccordionTab header="Passo a Passo: Como criar uma rotina">
                            <Accordion>
                                <AccordionTab header="Passo 1: Criação de Pessoas">
                                    <p className="m-0">
                                        Em Gerenciamento de Parâmetros, crie pessoas que serão utilizadas como parâmetros em vários presets.
                                    </p>
                                </AccordionTab>
                                <AccordionTab header="Passo 2: Criação de Atividades">
                                    <p className="m-0">
                                        Em Gerenciamento de Parâmetros, crie atividades que serão utilizadas na criação de várias atividades com presets.
                                    </p>
                                </AccordionTab>
                                <AccordionTab header="Passo 3: Criação de Cômodos">
                                    <p className="m-0">
                                        Em Gerenciamento de Parâmetros, crie cômodos que serão utilizadas como parâmetros na criação de vários presets.
                                    </p>
                                </AccordionTab>
                                <AccordionTab header="Passo 4: Leitura de Atuadores">
                                    <p className="m-0">
                                        Atuadores são parâmetros fixos no código original do HESTIA, portanto não é possível criá-los como um parâmetro. Entretanto, deve-se usar os atuadores como parâmetros que pertencem aos cômodos dentro de um preset.
                                    </p>
                                </AccordionTab>
                                <AccordionTab header="Passo 5: Criação de Preset">
                                    <p className="m-0">
                                        Após ter criado os parâmetros necessários, deve-se criar o preset. Selecione o nome, os cômodos que pertencem ao preset, os atuadores que podem ser utilizados em um cômodo e o grafo de distância entre os cômodos.
                                    </p>
                                </AccordionTab>
                                <AccordionTab header="Passo 6: Criação de Atividades com Presets">
                                    <p className="m-0">
                                        Depois de ter criado um preset, crie atividades relacionadas apenas àquele preset. Esta associação é necessária pois permite a utilização de propriedades pertencentes àquele preset, como cômodo e atuadores pertencentes aos cômodos.
                                    </p>
                                </AccordionTab>
                                <AccordionTab header="Passo 7: Criação de Rotinas">
                                    <p className="m-0">
                                        Após ter criado o preset e as atividades relacionadas àquele preset, vá em criar rotinas, adicione uma ou mais pessoas e construa a rotina da pessoa. Perceba que cada rotina deve completar 24h diárias.
                                    </p>
                                </AccordionTab>
                            </Accordion>
                        </AccordionTab>
                    </Accordion>
                </div>
            </section>
        </main>
    );
}
