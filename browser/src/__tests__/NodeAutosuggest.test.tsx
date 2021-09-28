import { configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import {expect} from 'chai';
import NodeAutoSuggestService from "../service/NodeAutosuggestService"



configure({adapter: new Adapter()});

describe("Map of class to Provider has correct short name", () => {

    test('test 1', () =>{
      const nodeAutoSuggest = new NodeAutoSuggestService();
      expect(nodeAutoSuggest.parseString(
        "java.util.Map<java.lang.Class<? extends com.snap.durablejob.DurableJob<?>>,javax.inject.Provider<"+
        "com.snap.durablejob.DurableJobProcessor<?,?>>>")).equals(
        "Map<Class<DurableJob<?>> Provider<DurableJobProcessor<?>>>"
        )
    })

    test('test 2', () => {
      const nodeAutoSuggest = new NodeAutoSuggestService();
      expect(nodeAutoSuggest.parseString("com.snap.dagger.browser.sample.CoffeeApp.CoffeeShop")).equals(
        "CoffeeApp.CoffeeShop")
    })

    test('test 3', () => {
      const nodeAutoSuggest = new NodeAutoSuggestService();
      expect(nodeAutoSuggest.parseString(
        "java.util.Map<java.lang.Class<? extends com.snap.durablejob.DurableJob<?>>,javax.inject.Provider<"+
        "com.snap.durablejob.DurableJobProcessor<?,?>>> com.snap.lenses.app.LensesDurableJobComponent_MultibindingsModule"+
        "#provide_socialUnlockResponseCacheCleanupProcessorMultibinding")).equals(
           "Map<Class<DurableJob<?>> Provider<DurableJobProcessor<?>>> LensesDurableJobComponentMultibindingsModule"
          )
    })

    test('test 4', () => {
      const nodeAutoSuggest = new NodeAutoSuggestService();
      expect(nodeAutoSuggest.parseString("@io.plaidapp.core.dagger.DesignerNewsApi okhttp3.OkHttpClient")).equals(
        "DesignerNewsApiOkHttpClient")
    })

    test('test 5', () => { 
      const nodeAutoSuggest = new NodeAutoSuggestService();
      expect(nodeAutoSuggest.parseString("io.plaidapp.core.dribbble.data.search.DribbbleSearchConverter.Factory")).equals(
        "DribbbleSearchConverter.Factory")
    })
  });

