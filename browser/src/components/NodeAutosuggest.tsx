import React, { useState, useMemo, useRef, useEffect } from "react";
import GraphManager, { GraphMatchResult } from "../models/GraphManager";
import Autosuggest from "react-autosuggest";
import NodeWeight from "./NodeWeight";
import WeightService from "../service/WeightService";
import DisplayNameHelper from "../util/DisplayNameHelper";
import "./NodeToolTip.css";
const MAX_SUGGESTIONS = 40;

interface Props {
  graphManager: GraphManager;
  weightService: WeightService;
  componentName: string | null | undefined;
  onSelect: (component: string | undefined, node: string) => any;
}

function getSuggestions(
  graphManager: GraphManager,
  componentName: string,
  value: string
): GraphMatchResult[] {
  return graphManager.getMatches(
    "",
    value.trim().toLowerCase(),
    MAX_SUGGESTIONS,
    false
  );
}

const NodeAutosuggest = ({ graphManager, weightService, onSelect, componentName }: Props) => {
  const [query, setQuery] = useState("");
  const searchRef = useRef<Autosuggest<GraphMatchResult>>(null);
  const displayNameHelper = new DisplayNameHelper()
  const suggestions = useMemo(
    () => getSuggestions(graphManager, componentName || "", query),
    [graphManager, componentName, query]
  );

  const autoFocusInput = (event?: KeyboardEvent) => {
    if (event && event.metaKey) {
      return false;
    }
    searchRef &&
      searchRef.current &&
      searchRef.current.input &&
      searchRef.current.input.focus();
  };

  useEffect(() => {
    autoFocusInput();
    window.addEventListener("keydown", autoFocusInput);
    return () => window.removeEventListener("keydown", autoFocusInput);
  }, []);

  return (
      <Autosuggest<GraphMatchResult>
        ref={searchRef}
        suggestions={suggestions}
        onSuggestionsFetchRequested={() => {}}
        onSuggestionsClearRequested={() => setQuery("")}
        onSuggestionSelected={(_, data) => {
          onSelect(data.suggestion.componentName, data.suggestion.node.key);
        }}
        getSuggestionValue={suggestion => suggestion.node.key}
        // TODO: Replace with simple node
        renderSuggestion={suggestion => (
          <div className = "tooltip_suggest">
            <span className="light-text">
              {suggestion.componentName
                ? "[" + suggestion.componentName.split(".").pop() + "] "
                : ""}
            </span>
            {displayNameHelper.displayNameForKey(suggestion.node.key)} &nbsp;
            <div className="tooltiptext_suggest">
              <span className="tooltiptext_suggest">{suggestion.node.key}</span>
            </div>
            <NodeWeight
              weight={weightService.getWeight(
                suggestion.componentName,
                suggestion.node.key
              )}
            />
          </div>
        )}
        inputProps={{
          value: query,
          placeholder: "Find dependencies",
          onChange: (_, params) => {
            setQuery(params.newValue);
          }
        }}
      />
  );
};

export default NodeAutosuggest;
