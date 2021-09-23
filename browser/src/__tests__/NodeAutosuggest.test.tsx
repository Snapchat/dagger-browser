import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import {expect} from 'chai';
import NodeAutoSuggestService from "../service/NodeAutosuggestService"
import React from 'react';



configure({adapter: new Adapter()});

describe("Map of class to Provider has correct short name", () => {
    test("should display a blank login form, with remember me checked by default", async () => {
      // ???
    });

    test('sum 1 + 2 = 3' , () => {
      const nodeContainer = shallow(<NodeAutoSuggestService/>);
      expect((nodeContainer.instance() as NodeAutoSuggestService).add(1,2)).equals(3)
    })

  });

