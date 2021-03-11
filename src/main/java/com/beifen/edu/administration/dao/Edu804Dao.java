package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu801;
import com.beifen.edu.administration.domian.Edu804;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

@Configuration
public interface Edu804Dao extends JpaRepository<Edu804, Long>, JpaSpecificationExecutor<Edu804> {
    //根据所属二级学院查询所有调查问卷
    @Query(value = "select Edu801_ids from Edu804 where USER_ID = ?1",nativeQuery = true)
    String questionsAnswer(String userId);

    @Query(value = "select * from Edu804 where USER_ID = ?1",nativeQuery = true)
    Edu804 queryByUserId(String userId);

}
