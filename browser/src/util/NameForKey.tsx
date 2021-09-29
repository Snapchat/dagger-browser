export class Helper {
    //constructor is empty, only necessary to access methods parseString, and addQuestionsMarks
    constructor() {}

    /* 
    Component is passed in and a shorter name of the component is returned, 
    */
    displayNameForKey(component: string){
        var token: string = ""
        var shorter_component: string = ""
        for (var i =0; i < component.length; i++) {
            //when a space is detected, a token will be passed , then append the formated token to the "shorter_component" var
            if (component.charAt(i) == ' ') {
                // will not append empty tokens eg "extends"
                if(this.returnProcessedToken(token) == ""){
                    token = ""
                    continue
                }
                shorter_component += this.returnProcessedToken(token) + " "
                token = ""
                continue
            }
            token += component.charAt(i)
        }
        shorter_component += this.returnProcessedToken(token)
        return shorter_component
    }

    /*
        token is processed and returns a formatted token
    */
    returnProcessedToken(token: string) {
        var processed_token: string = ""
        for(var i =0; i < token.length; i++){
            let token_c = token.charAt(i)
            if (token_c == '#') {
                break;
            }
            //append special characters for formating purposes
            if(token_c == '@' || token_c == '>' || token_c == ',' || token_c == '<' || token_c == '?'){
                processed_token += token_c
                // both conditions make sure checking for the next character is not out of range, then checks if a space is necessary after a closing angle bracket or a comma

                /*
                    eg: com.snap.durablejob.DurableJob<?>>,javax.inject.Provider<com.snap.durablejob.DurableJobProcessor<?,?>>> 
                    this token should return: DurableJob<?>>, Provider<DurableJobProcessor<?,?>>>
                                                            ^^
                                                            these two should be split, so an extra space is appended to the processed_token string

                */
                if (i < token.length-1 && token_c == '>' && token.charAt(i+1) != '>' && token.charAt(i+1) != ',' && token.charAt(i+1) != ' ') {
                    processed_token += " "
                } else if (i < token.length-1 && token_c == ',' && token.charAt(i+1) != '?') {
                    processed_token += " "
                }
            }
            //checks if a class name is being used, then iterates through the token and makes sure the next characters are alphabetical characters or dots (.)
            else if (token_c === token_c.toUpperCase() && token_c.match(/[A-Z]/i)) {
                processed_token += token_c
                i++
                while (i < token.length && token.charAt(i) != ' ' && token.charAt(i).match(/[a-zA-Z.]/i)) {
                    processed_token+= token.charAt(i)
                    i++
                }
                //decrement back to the original position or position where the condition above was false
                i--
            }
        }
        return processed_token
    }
}
export default Helper
