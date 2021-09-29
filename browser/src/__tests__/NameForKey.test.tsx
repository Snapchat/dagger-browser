import { configure} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import {expect} from 'chai'
import Helper from '../util/NameForKey'

configure({adapter: new Adapter()});

describe("Map of class to Provider has correct short name", () => {

    const nodeAutoSuggest : Helper = new Helper()
  
    test('test 1, from CoffeeApp Example', () => {
      expect(nodeAutoSuggest.displayNameForKey("com.snap.dagger.browser.sample.CoffeeApp.CoffeeShop")).equals(
        "CoffeeApp.CoffeeShop")
    })

    test('test 3, from HomeComponent', () => {
      expect(nodeAutoSuggest.displayNameForKey("@io.plaidapp.core.dagger.DesignerNewsApi okhttp3.OkHttpClient")).equals(
        "@DesignerNewsApi OkHttpClient")
    })

    test('test 4, from DribleSearchConverter.Factory', () => { 
      expect(nodeAutoSuggest.displayNameForKey("io.plaidapp.core.dribbble.data.search.DribbbleSearchConverter.Factory")).equals(
        "DribbbleSearchConverter.Factory")
    })

    test('test 5, from HomeComponent', () => {
      expect(nodeAutoSuggest.displayNameForKey("io.plaidapp.core.designernews.data.login.LoginLocalDataSource")).equals("LoginLocalDataSource")
    })

    test('test 6, from MushroomFeatureGraphDurableJobRegistry', () => {
      expect(nodeAutoSuggest.displayNameForKey(
        "java.util.Map<java.lang.Class<? extends com.snap.durablejob.DurableJob<?>>,javax.inject.Provider<"+
        "com.snap.durablejob.DurableJobProcessor<?,?>>> com.snap.lenses.app.LensesDurableJobComponent_MultibindingsModule"+
        "#provide_socialUnlockResponseCacheCleanupProcessorMultibinding")).equals(
           "Map<Class<? DurableJob<?>>, Provider<DurableJobProcessor<?,?>>> LensesDurableJobComponentMultibindingsModule"
          )
        //The first question mark is appended to represent unknown type in generics eg extends and to help avoid more conditions ** can add in the future
      })
  });