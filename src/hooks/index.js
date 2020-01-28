import { useState, useEffect } from "react";
import moment from "moment";
import { firebase } from "../firebase";
import { collatedTasksExist } from "../helpers";

// const collatedTasksExist = () => {};

export const useTasks = selectedProject => {
  const [tasks, setTasks] = useState([]);
  const [archivedTasks, setArchivedTasks] = useState([]);

  useEffect(() => {

    // Firebase go and get our tasks where the user id = -Jldh2kvv9KyrkBuTTjV
    let unsubscribe = firebase.firestore().collection('tasks').where('userId', '==', '-Jldh2kvv9KyrkBuTTjV');

    /**
     * Go through all the tasks and check the key of the project
     * if you have 5 tasks go through each one and check the key for example 1 
     * 
     * give me the task for the selected project
     */
    unsubscribe = selectedProject && !collatedTasksExist(selectedProject) ?
    (unsubscribe = unsubscribe.where('projectId', '==', selectedProject))
    : selectedProject === 'TODAY' ?
    (unsubscribe = unsubscribe.where('date', '==', moment().format('DD/MM/YYYY')))
    :selectedProject === 'INBOX' || selectedProject === 0 ? (unsubscribe = unsubscribe.where('date', '==', '')):unsubscribe;
     

    unsubscribe = unsubscribe.onSnapshot(snapshot => {
        //get docs from firestore
        const newTask = snapshot.docs.map(task =>({
            id: task.id,
            ...task.data(),
        }))

        //once we have the data then we set task
        setTasks(
            selectedProject === 'NEXT_7' ? newTask.filter(
                //give if us the one < 7 and make sure they are not archived
                task => moment(task.date, 'DD-MM-YYYY').diff(moment(), 'days') <= 7 &&
                task.archived !== true
            ): newTask.filter(task => task.archived !== true)
        )

        setArchivedTasks(newTask.filter(task => task.archived !== false)); // give me all the task that true
    })
    // return unsub because we dont want to  check for project all the time and only where is there is a new selected project
    return () => unsubscribe();
  }, [selectedProject]); // when selectedProject changes re-run all of the above

  //
  return {tasks, archivedTasks};
};


export const useProjects = () => {
    const [projects, setProjects] = useState([]);
    useEffect(() => {
        firebase.firestore().collection('projects').where('userId', '==', '-Jldh2kvv9KyrkBuTTjV')
        .orderBy('projectId')
        .get()
        .then(snapshot => {
            const allProjects = snapshot.docs.map(project => ({
                ...project.data(),
                docId: project.id,
            }))

            if(JSON.stringify(allProjects) !== JSON.stringify(projects)) {
                setProjects(allProjects)
            }
        })
    }, [projects]);
   
    return { projects, setProjects}
}