package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu996;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

@Configuration
public interface Edu996Dao extends JpaRepository<Edu996, Long>, JpaSpecificationExecutor<Edu996> {

}
