import { configure} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import {expect} from 'chai'
import DisplayNameHelper from '../util/DisplayNameHelper'

configure({adapter: new Adapter()});

// to run tests: cd browser && npm run test:watch
describe("Various classes in the Dagger Graph, will return the correct shorter name", () => {

    const displayNameHelper : DisplayNameHelper = new DisplayNameHelper()
  
    test('test 1, displayNameHelper_Should_Return_CoffeeApp.CoffeeShop', () => {
      expect(displayNameHelper.displayNameForKey("com.snap.dagger.browser.sample.CoffeeApp.CoffeeShop")).equals(
        "CoffeeApp.CoffeeShop")
    })

    test('test 2, displayNameHelperShouldReturn_@DesignerNewsApi OkHttpClient', () => {
      expect(displayNameHelper.displayNameForKey("@io.plaidapp.core.dagger.DesignerNewsApi okhttp3.OkHttpClient")).equals(
        "@DesignerNewsApi OkHttpClient")
    })

    test('test 3, displayNameHelperShouldReturn_LoginLocalDataSource', () => {
      expect(displayNameHelper.displayNameForKey("io.plaidapp.core.designernews.data.login.LoginLocalDataSource")).equals(
        "LoginLocalDataSource"
        )
    })

    test('test 4, displayNameHelperShouldReturn_Map<Class<? DurableJob<?>>, Provider<DurableJobProcessor<?,?>>>' + 
    ' LensesDurableJobComponentMultibindingsModule', () => {
      expect(displayNameHelper.displayNameForKey(
        "java.util.Map<java.lang.Class<? extends com.snap.durablejob.DurableJob<?>>,javax.inject.Provider<"+
        "com.snap.durablejob.DurableJobProcessor<?,?>>> com.snap.lenses.app.LensesDurableJobComponent_MultibindingsModule"+
        "#provide_socialUnlockResponseCacheCleanupProcessorMultibinding")).equals(
           "Map<Class<? DurableJob<?>>, Provider<DurableJobProcessor<?,?>>> LensesDurableJobComponentMultibindingsModule"
          )
      })
  });