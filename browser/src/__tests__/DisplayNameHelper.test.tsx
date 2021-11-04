import { configure} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import {expect} from 'chai'
import DisplayNameHelper from '../util/DisplayNameHelper'

configure({adapter: new Adapter()});

// to run tests: cd browser && npm run test:watch
describe("Various classes in the Dagger Graph, will return the correct shorter name", () => {

    const displayNameHelper : DisplayNameHelper = new DisplayNameHelper()
  
    test('displayNameHelper_Should_Return_CoffeeApp.CoffeeShop', () => {
      expect(displayNameHelper.displayNameForKey("com.snap.dagger.browser.sample.CoffeeApp.CoffeeShop")).equals(
        "CoffeeApp.CoffeeShop")
    })

    test('displayNameHelperShouldReturn_@DesignerNewsApi OkClient', () => {
      expect(displayNameHelper.displayNameForKey("@io.plaidapp.core.dagger.DesignerNewsApi okhttp3.OkClient")).equals(
        "@DesignerNewsApi OkClient")
    })

    test('displayNameHelperShouldReturn_Login', () => {
      expect(displayNameHelper.displayNameForKey("com.snap.dagger.sample.data.login.Login")).equals(
        "Login"
        )
    })

    test('displayNameHelperShouldReturn_Map<Class<? DurableJob<?>>, Provider<DurableJobProcessor<?,?>>>' + 
    ' AuthorDetailsModule', () => {
      expect(displayNameHelper.displayNameForKey(
        "java.util.Map<java.lang.Class<? extends com.snap.dagger.DurableJob<?>>,javax.inject.Provider<"+
        "com.snap.dagger.DurableJobProcessor<?,?>>> com.snap.dagger.browser.AuthorDetailsModule"+
        "#Multibinding")).equals(
           "Map<Class<? DurableJob<?>>, Provider<DurableJobProcessor<?,?>>> AuthorDetailsModule"
          )
      })
    
    test('displayNameHelperShouldReturn_CoffeeMachine.CoffeeMachine', () => {
      expect(displayNameHelper.displayNameForKey("com.snap.dagger.browser.sample.CoffeeMachine.CoffeeMachine")
      ).equals("CoffeeMachine.CoffeeMachine")
    })

    test('displayNameHelperShouldReturn_CoffeeBeans', () => {
      expect(displayNameHelper.displayNameForKey("com.snap.dagger.browser.sample.CoffeeBeans")
      ).equals("CoffeeBeans")
    })
  });