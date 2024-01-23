import { Box, Modal, TextField } from "@mui/material";
import Sidebar from "../components/Sidebar";
import React from "react";
import { ThemeProvider } from "@emotion/react";
import { LoadingButton } from "@mui/lab";
import { createTheme } from "@mui/material/styles";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

const theme = createTheme({
  palette: {
    grafit: {
      main: "#032539",
      light: "#053b5b",
      dark: "#02121c",
      contrastText: "#ffffff",
    },
    orange: {
      main: "#FA991C",
      light: "#fbbe70",
      dark: "#df8006",
      contrastText: "#ffffff",
    },
    apple: {
      main: "#3ec116",
      light: "#48dc1b",
      dark: "#3bb516",
      contrastText: "#ffffff",
    },
    silver: {
      main: "#b0b7c6",
      light: "#c7cbd3",
      dark: "##858d9e",
      contrastText: "#ffffff",
    },
  },
});

const companiesList = [
  {
    id: 1,
    name: "ООО 'ВЗС'",
    projects: [
      {
        id: 2312,
        name: "Основная деятельность",
        
      },
    ],
  },
  {
    id: 2,
    name: "ООО 'Аркелит'",
    projects: [
      {
        id: 231,
        name: "Совхозная, 12",
        
      },
      {
        id: 232,
        name: "Лесная, 38",
        
      },
      {
        id: 233,
        name: "Ленина, 6",
     
      },
    ],
  },
  {
    id: 5,
    name: "ООО 'Ижарболит'",
    projects: [],
  },
];

const boxStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.papper",
  boxShadow: 24,
  p: 4,
};

export default function Companies() {
  const [openAddProject, setOpenAddProject] = React.useState(false);
  const [companies, setCompanies] = React.useState(companiesList);
  const [projectName, setProjectName] = React.useState("");
  const [modalIndex, setModalIndex] = React.useState(0);
  const [loadingSave, setLoadingSave] = React.useState(false)

  const openProjectModal = (url) => {
    setOpenAddProject(true);
  };
  const closeProjectModal = () => {
    setProjectName("");
    setOpenAddProject(false);
  };

  const changeProject = (index, projectId) => {
    if (!projectId) {
      setLoadingSave(true)
      const newCompaniesList = companies.map((el, i) => {
        if (i === index) {
          companies[index].projects.push({
            id: Math.floor(Math.random() * 40),
            name: projectName,
          });
        }

        setTimeout(() => {
          setProjectName("")
          setLoadingSave(false)
          setCompanies(newCompaniesList);
          setOpenAddProject(false);
        }, 1000);
        return el;
      });
    } else {
      const newCompaniesList = companies.map((el, i) => {
        if (i === index) {
          const newProjects = el.projects.filter(element => {
            if(element.id !== projectId){
              return(element)
            }
              
          })
          el.projects = newProjects
        }
        //   companies[index].projects.filter((project, number) => {
        //     if (project.id === projectId) {
        //       project.deleted = true
        //     }
        //     return project
        //   })
        // }
        return el
      })
      setCompanies(newCompaniesList)
    }


  };

  const handleInputChange = (e) => {
    setProjectName(e.target.value);
  };

  return (
    <div>
      <div className="h-full w-full flex flex-col justify-center items-center p-10">
        <div className="flex relative w-[1255px] mr-5">
          <div className="mt-6 mr-3 absolute  -left-56">
            <Sidebar active={1} />
          </div>
          <div className=" w-[850px]">
            {!companies ? (
              <div className="w-full text-xl min-w-96 mt-6 flex justify-center bg-white shadow-md shadow-white rounded-xl items-center p-5">
                Компаний нет
              </div>
            ) : (
              companies.map((el, index) => {
                return (
                  <div
                    key={index}
                    className="w-full mt-6 flex relative bg-white shadow-md shadow-white rounded-xl items-center p-5"
                  >
                    <div className="ml-4 text-grafit text-lg w-full text-left flex flex-col justify-center h-full">
                      <div className="font-bold text-xl">{el.name}</div>
                      <div className="mt-4 mb-3">
                        {el.projects.length > 0 ? "Проекты: " : "Проектов нет"}
                      </div>
                      {el.projects.map((element, i) => {
                        return (
                          <div key={i} className="flex">
                            <div className="mb-1">
                              {element.name}
                            </div>
                            <div className="ml-1 ">
                              <IconButton size="small"  onClick={() => changeProject(index, element.id)} aria-label="delete">
                                <CloseIcon fontSize="inherit" />
                              </IconButton>    
                            </div>

                          </div>

                        );
                      })}
                      <div className="flex justify-between mt-4">
                        <ThemeProvider theme={theme}>
                          <div className="flex">
                            <Box>
                              <LoadingButton
                                variant="outlined"
                                onClick={() => { setOpenAddProject(true); setModalIndex(index) }}
                                color="grafit"
                              >
                                Добавить проект
                              </LoadingButton>
                            </Box>
                            <Modal
                              open={openAddProject}
                              onClose={closeProjectModal}
                              className="rounded-xl"
                            >
                              <Box
                                sx={boxStyle}
                                className="bg-white rounded-xl"
                              >
                                <div>
                                  <div className="text-2xl font-bold mb-5">
                                    Добавление проекта
                                  </div>
                                  <div className="text-lg mb-2">
                                    Введите название проекта:
                                  </div>
                                  <TextField
                                    value={projectName}
                                    onChange={handleInputChange}
                                    className=" w-full"
                                    size="small"
                                    variant="outlined"
                                  ></TextField>
                                </div>
                                <div className="mt-3">
                                  <LoadingButton
                                    variant="outlined"
                                    onClick={() => changeProject(modalIndex)}
                                    color="apple"
                                    loading={loadingSave}
                                  >
                                    Сохранить
                                  </LoadingButton>
                                </div>
                              </Box>
                            </Modal>
                          </div>
                        </ThemeProvider>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="w-[389px] ml-3 h-max"></div>
        </div>
      </div>
    </div>
  );
}
