// package com.example.demo.command;

// import org.springframework.boot.CommandLineRunner;
// import org.springframework.stereotype.Component;
// import net.datafaker.Faker;
// import lombok.RequiredArgsConstructor;
// import java.util.Locale;
// import com.example.demo.repository.StoreRepository;
// import com.example.demo.repository.UserRepository;
// import com.example.demo.entity.Store;
// import com.example.demo.entity.User;
// import java.util.Random;

// import org.springframework.security.crypto.password.PasswordEncoder;

// @Component
// @RequiredArgsConstructor
// public class FakeData implements CommandLineRunner {

//     private final StoreRepository storeRepository;
//     private final UserRepository userRepository;
//     @Override   
//     public void run(String... args) {
//         Faker faker = new Faker(new Locale("vi"));
//         User user = userRepository.findById(202L).orElseThrow();
//         Random random = new Random();

//         for (int i = 0; i < 100; i++) {
//             Store store = new Store();
//             store.setName(faker.address().fullAddress());

//             store.setQuantity(random.nextInt(100));
//             store.setPrice(random.nextDouble() * 1000000);
//             store.setImage("https://picsum.photos/200?random=" + i);
//             store.setCreatedDate(System.currentTimeMillis());
//             store.setUpdatedDate(System.currentTimeMillis());

//             store.setUser(user);

//             storeRepository.save(store);
//         }
//     }
// }