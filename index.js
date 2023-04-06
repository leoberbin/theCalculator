import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

(function(){
    class App extends React.Component{
        constructor(props){
            super(props);
            this.state = {
                output:{rs:"0", 
                        eq:"" },
                input:["0"],
                dot:!0,
                equal:!0,
                limit:0
            };
            this.handleInput=this.handleInput.bind(this);
            this.handleOutput=this.handleOutput.bind(this);
            this.getResults=this.getResults.bind(this);
        };
        handleInput(event, value){
            const e = event !== undefined ? event.target.value : value; 
            const {input, dot, limit} = this.state; const i = input[input.length - 1];
            const {rs} = this.state['output'];
            const r = /ac/; const n = /\d/; const o = /[x+/-]/; const d = /\./; 
            const eql = /=/; const del = /del/; 
            !eql.test(e) && this.setState({equal:!0});
            !n.test(e) && !d.test(e) && this.setState({limit:0, dot:!0});
            if(!r.test(e)){
                if(n.test(e) && limit < 16){
                    this.setState({limit: limit + 1});
                    d.test(i) + parseFloat(i) <= 0 && input.splice(input.length - 1, 1, "");
                    !n.test(i) ? input.push(e) : 
                    input.push(input.splice(input.length - 1, 1) + e)
                }else if(o.test(e)){
                    if(input.length === 1 && input[0] <= rs){
                        input.splice(0, 1, rs);
                    }; this.setState({dot:!0});
                    /\.$/.test(i) && input.push(input.splice(input.length - 1,1) + "00") 
                    !o.test(i) ? input.push(e) : 
                    input.splice(input.length - 1, 1, e);
                }else if(d.test(e)){
                    if(dot){
                        !n.test(i) ? input.push("0" + e) : 
                        input.push(input.splice(input.length - 1, 1) + e);
                    }; this.setState( {dot:!1} );
                }else if(del.test(e)){
                    input.length===1 ? input.splice(i , 1, "0") :
                    n.test(i) && input.pop();
                    console.log(input)
                }else if(eql.test(e)){
                    input.splice(input.length - 1,1, i.replace(/\.$/, "")) 
                    !n.test(i) && input.push("0") ; 
                }; this.setState({ input: input });
            }else{ 
                this.setState({
                    input:["0"], 
                    dot:!0,
                    equal:!0,
                })
            }; this.handleOutput(e);
        };
        handleOutput(e){
            let {rs, eq} = this.state['output'];
            const {input, equal} = this.state;
                eq = input.join(" ");
                rs = input[input.length - 1]
                this.setState({ 
                    output:{ rs: rs,
                             eq: eq }
                }); 
                const reset = /ac/.test(e);
                const del = /del/.test(e);
                const get = /=/.test(e);
                reset && this.setState( {output:{rs:"0", eq:""}} );
                del && this.setState( {output:{rs:"0", eq:eq}} );
                if(equal){
                    get && this.getResults();
                };
        };
        getResults(){
            const {input} = this.state;
            this.setState( {equal : !1} )
                while(input.includes("/")){
                    const i = input.indexOf("/") - 1;
                    input.splice(i, 3, parseFloat(input[i]) / parseFloat(input[i + 2]));
                };
                while(input.includes("x")){
                    const i = input.indexOf("x") - 1;
                    input.splice(i , 3, parseFloat(input[i]) * parseFloat(input[i + 2]));
                };
                while(input.includes("-")){
                    const i = input.indexOf("-") - 1;
                    input.splice(i, 3, parseFloat(input[i]) - parseFloat(input[i + 2]));
                };
                while(input.includes("+")){
                    const i = input.indexOf("+") - 1;
                    input.splice(i, 3, parseFloat(input[i]) + parseFloat(input[i + 2]));
                }; 
                const strInput=input[0].toString()
                                       .toLocaleUpperCase()
                                       .split("")
                while(strInput.length > 15){
                   const i = strInput.indexOf("E") - 1
                   strInput.splice(i, 1)
                };
                this.setState({
                    output:{ rs: strInput.join(""), eq: "" },
                    input: ["0"]
                }); 
        }
        render(){
        const hanledkeys = (event) => {
            const e = event.key;
            const value = e === "1" ? "1" : e === "2" ? "2" : e === "3" ? "3" : e === "4" ? "4" :
                          e === "5" ? "5" : e === "6" ? "6" : e === "7" ? "7" : e === "8" ? "8" :
                          e === "9" ? "9" : e === "0" ? "0" : e === "." ? "." :
                          e === "+" ? "+" : e === "-" ? "-" : e === "*" ? "x" : e === "/" ? "/" :
                          e === "Delete" ? "del" : e === "End" ? "ac" : e === "Enter" && "="
            this.handleInput(undefined, value);
        }; window.onkeydown=hanledkeys;
        const {rs : result , eq : equation} = this.state['output'];
            return(
                <div>
                    <div id='calculator'>
                        <Display eq={equation} rs={result} />
                        <Buttons f={this.handleInput}/>
                    </div>
                    <div id='welcome'>
                        <h1>Welcome</h1>
                    </div>
                </div>
            );
        };
    };
    class Display extends React.Component{
        render(){
            return(
                <div id='display'>
                    <div id='equation'>{this.props.eq}</div>
                    <div id='result'>{this.props.rs}</div>
                </div>
            ); 
        };
    };
    class Buttons extends React.Component{
        render(){
            return(
               <div id='button-container' onMouseDown={this.props.f}>
                    <button id='clear' value='ac'>AC</button>
                    <button id='delete' value='del'>C</button>
                    <button id='divide' value='/'>/</button>
                    <button id='multiply' value='x'>x</button>
                    <button id='seven' value='7'>7</button>
                    <button id='eight' value='8'>8</button>
                    <button id='nine' value='9'>9</button>
                    <button id='subtract' value='-'>-</button>
                    <button id='four' value='4'>4</button>
                    <button id='five' value='5'>5</button>
                    <button id='six' value='6'>6</button>
                    <button id='add' value='+'>+</button>
                    <button id='one' value='1'>1</button>
                    <button id='two' value='2'>2</button>
                    <button id='three' value='3'>3</button>
                    <button id='equals' value='='>=</button>
                    <button id='zero' value='0'>0</button>
                    <button id='decimal' value='.'>.</button>
               </div>
            );
        };
    };
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
})()