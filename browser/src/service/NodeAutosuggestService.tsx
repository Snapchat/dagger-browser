import React from "react"

export class NodeAutosuggestService {
    //constructor is empty, only necessary to access methods parseString, and addQuestionsMarks
    constructor() {}

    /* 
    Component is passed in and a shorter name of the component is returned, 
    Time Complexity O(n)
    Space Complexity O(n)
    */
    parseString(component: string) {
        var shorter_component = ""
        for (var i = 0; i < component.length; i++) {
            let c = component.charAt(i)
            if (c == '#') {
                break;
            }
            else if (c == ">") {
                shorter_component += c
            }
            else if (c == "<") {
                shorter_component += c;
                i++
                if (component.charAt(i) === component.charAt(i).toUpperCase() && component.charAt(i) != " ") {
                    while (i < component.length && component.charAt(i) != ' ' && component.charAt(i).match(/[a-zA-Z.]/i)) {
                        let build = component.charAt(i)
                        shorter_component+= build
                        i++
                    }
                }
                //decrement to go back to previous position where the condition above wasn't met 
                i--
            }
            else if (c === c.toUpperCase() && c != " " && c.match(/[a-zA-Z]/i)) {
                shorter_component += c
                i++
                while (i < component.length && component.charAt(i) != ' ' && component.charAt(i).match(/[a-zA-Z.]/i)) {
                    let build = component.charAt(i)
                    shorter_component+= build
                    i++
                }
                //decrement to go back to previous position where the condition above wasn't met 
                i--
            }
        }
        return this.addQuestionMarks(shorter_component)
    }
    /* 
    After the component is parsed, question marks and spacing is added where conditions are met
    Time Complexity O(n)
    Space Complexity O(n)
    */
    addQuestionMarks(component: string) {
        var shorter_component = ""
        for (var i = 0; i < component.length; i++) {
            let c = component.charAt(i)
            shorter_component+= c
            if (i < component.length-1 && c == '<' && component.charAt(i+1) == '>') {
                shorter_component += "?"
            }
            else if (i < component.length-1 && c == '>' && component.charAt(i+1) != '>') {
                shorter_component += " "
            }
        }
        return shorter_component.toString()
    }
}
export default NodeAutosuggestService